from fastapi import APIRouter, HTTPException
from numpy import select
from database.supabase_client import supabase
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

router = APIRouter()


# -----------------------------------------------------------------------
# GET /recommend/{email}
# "Recommended For You" — used on the /books page
# -----------------------------------------------------------------------
@router.get("/recommend/{email}")
def initial_recommendations(email: str):

    # Get user profile
    try:
        profile = (
            supabase.table("profiles")
            .select("id, favorite_genres")
            .eq("email", email)
            .single()
            .execute()
        )
    except Exception:
        profile = None

    if not profile or not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    favorite_genres = profile.data.get("favorite_genres", [])
    user_id = profile.data["id"]

    if not favorite_genres:
        raise HTTPException(status_code=404, detail="No favorite genres selected")

    # Get reviewed books
    reviews = (
        supabase.table("reviews")
        .select("book_id")
        .eq("user_email", email)
        .execute()
    )
    reviewed_books = [int(r["book_id"]) for r in reviews.data] if reviews.data else []

    # Get cart books
    cart = (
        supabase.table("cart")
        .select("book_id")
        .eq("user_id", user_id)
        .execute()
    )
    cart_books = [int(c["book_id"]) for c in cart.data] if cart.data else []

    # Get all books
    books = (
       supabase
        .table("books")
        .select("id, title, author, genre, price, cover, rating")
        .in_("genre", favorite_genres)
        .execute()
    )

    recommendations = []

    for book in (books.data or []):

        # Only favorite genres
        if book["genre"] not in favorite_genres:
            continue

        if int(book["id"]) in reviewed_books:
            continue

        if int(book["id"]) in cart_books:
            continue

        if any(r["id"] == book["id"] for r in recommendations):
            continue

        recommendations.append({
            "id": book["id"],
            "title": book["title"],
            "author": book["author"],
            "genre": book["genre"],
            "price": float(book.get("price") or 0),
            "cover": book.get("cover") or "",
            "rating": float(book.get("rating") or 0),
        })

    # Fallback: pad out with popular books if not enough genre matches
    if len(recommendations) < 5:

        popular_books = (
            supabase.table("books")
            .select("id, title, author, genre, price, cover, rating")
            .order("rating", desc=True)
            .limit(10)
            .execute()
        )

        for book in (popular_books.data or []):

            if int(book["id"]) in reviewed_books:
                continue

            if int(book["id"]) in cart_books:
                continue

            if any(r["id"] == book["id"] for r in recommendations):
                continue

            recommendations.append({
                "id": book["id"],
                "title": book["title"],
                "author": book["author"],
                "genre": book["genre"],
                "price": float(book.get("price") or 0),
                "cover": book.get("cover") or "",
                "rating": float(book.get("rating") or 0),
            })

    return {"recommendations": recommendations[:10]}


# -----------------------------------------------------------------------
# GET /recommend/{email}/{title}
# "Recommend Similar Books" — used on the Book Details page
# -----------------------------------------------------------------------
@router.get("/recommend/{email}/{title}")
def recommend_books(email: str, title: str):

    # Fetch all books
    result = supabase.table("books").select("*").execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="No books found")

    df = pd.DataFrame(result.data)

    # Fetch all reviews
    reviews_result =(
         supabase
         .table("reviews")
         .select("id,user_email,book_id,rating").execute()
    )
    print("REVIEWS RESPONSE:", reviews_result)
    print("REVIEWS DATA:", reviews_result.data)

    reviews_df = pd.DataFrame(reviews_result.data or [])
    print("REVIEWS DF:")
    print(reviews_df)

    # Fetch cart
    cart_result = supabase.table("cart").select("*").execute()
    cart_df = pd.DataFrame(cart_result.data)
    reviews_df["book_id"] = pd.to_numeric(
            reviews_df["book_id"], errors="coerce"
        )

    reviews_df["rating"] = pd.to_numeric(
            reviews_df["rating"], errors="coerce"
        )
    reviews_df = reviews_df.dropna(
            subset=["book_id", "rating"]
        )

    reviews_df["book_id"] = reviews_df["book_id"].astype(int)

    df["id"] = pd.to_numeric(
            df["id"], errors="coerce"
        )

    df["id"] = df["id"].astype(int)
    if reviews_df.empty:
        reviews_df = pd.DataFrame(columns=["user_email", "book_id", "rating"])
    if cart_df.empty:
        cart_df = pd.DataFrame(columns=["user_id", "book_id", "quantity"])

    rating_avg = (
        reviews_df.groupby("book_id")["rating"]
        .mean()
        .reset_index(name="avg_rating")
    )
    rating_count = (
        reviews_df.groupby("book_id")["rating"]
        .count()
        .reset_index(name="review_count")
    )
    cart_count = (
        cart_df.groupby("book_id")
        .size()
        .reset_index(name="cart_count")
    )

    df = df.merge(rating_avg, left_on="id", right_on="book_id", how="left").drop(columns=["book_id"])
    df = df.merge(rating_count, left_on="id", right_on="book_id", how="left").drop(columns=["book_id"])
    df = df.merge(cart_count, left_on="id", right_on="book_id", how="left").drop(columns=["book_id"])

    print(
    df[df["title"].isin([
        "Rich Dad Poor Dad",
        "Zero to One",
        "Start with Why",
        "The Psychology of Money",
        "Built to Last"
    ])][
        ["id", "title", "avg_rating", "review_count"]
    ]
)
    print(
    reviews_df[
        reviews_df["book_id"].isin([37, 38, 39, 40, 41])
    ][
        ["user_email", "book_id", "rating"]
    ]
)

    df["avg_rating"] = df["avg_rating"].fillna(0)
    df["review_count"] = df["review_count"].fillna(0)
    df["cart_count"] = df["cart_count"].fillna(0)
    df["actual_avg_rating"] = df["avg_rating"]

    scaler = MinMaxScaler()
    df[["normalized_avg_rating", "normalized_review_count", "normalized_cart_count"]] = scaler.fit_transform(
        df[["avg_rating", "review_count", "cart_count"]]
    )

    # Make sure required text columns exist
    for col in ["title", "author", "genre", "description"]:
        if col not in df.columns:
            df[col] = ""

    # Combine text for TF-IDF
    df["content"] = (
        df["title"].fillna("") + " " +
        df["author"].fillna("") + " " +
        df["genre"].fillna("") + " " +
        df["description"].fillna("")
    )

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["content"])
    similarity = cosine_similarity(tfidf_matrix)

    # Get user profile
    try:
        profile = (
            supabase.table("profiles")
            .select("id, favorite_genres")
            .eq("email", email)
            .single()
            .execute()
        )
    except Exception:
        profile = None

    if not profile or not profile.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    favorite_genres = profile.data.get("favorite_genres", [])
    user_id = profile.data["id"]

    user_reviews = reviews_df[reviews_df["user_email"] == email]
    reviewed_books = [int(b) for b in user_reviews["book_id"].tolist()]

    user_cart = cart_df[cart_df["user_id"] == user_id]
    cart_books = [int(b) for b in user_cart["book_id"].tolist()]

    

    # If user has no history at all, just return popularity-based picks
    if user_reviews.empty and user_cart.empty:

        df["popularity"] = (
            df["normalized_avg_rating"] * 0.6 +
            df["normalized_review_count"] * 0.2 +
            df["normalized_cart_count"] * 0.2
        )

        if favorite_genres:
            fav_df = df[df["genre"].isin(favorite_genres)]
            if not fav_df.empty:
                df = fav_df

        df = df.sort_values("popularity", ascending=False)

        recs = []
        for _, book in df.head(5).iterrows():
            recs.append({
                "id": int(book["id"]),
                "title": book["title"],
                "author": book["author"],
                "genre": book["genre"],
                "price": float(book.get("price") or 0),
                "cover": book.get("cover") or "",
                "avg_rating": round(float(book.get("actual_avg_rating") or book.get("rating") or 0), 1),
                "recommendation_score": round(float(book.get("popularity", 0.85)), 2),
                "match_percentage": 88,
                "reason": "Top rated book in popular categories",
            })

        return {"recommendations": recs}

    # -----------------------------
    # Collaborative Filtering (reviews)
    # -----------------------------
    review_similar_users = pd.Series(dtype=float)

    if not reviews_df.empty:

        rating_matrix = reviews_df.pivot_table(
            index="user_email",
            columns="book_id",
            values="rating"
        )

        user_similarity = cosine_similarity(rating_matrix.fillna(0))

        review_similarity_df = pd.DataFrame(
            user_similarity,
            index=rating_matrix.index,
            columns=rating_matrix.index
        )

        if email in review_similarity_df.index:
            review_similar_users = (
                review_similarity_df[email]
                .sort_values(ascending=False)
                .drop(email)
            )
            print("==========  REVIEW SIMILAR USERS ==========")
            print(review_similar_users)
            print("===================================")

    # -----------------------------
    # Cart Collaborative Filtering
    # -----------------------------

    cart_similarity_df = pd.DataFrame()
    cart_matrix=pd.DataFrame()

    if not cart_df.empty:

        cart_matrix = cart_df.pivot_table(
            index="user_id",
            columns="book_id",
            aggfunc="size",
            fill_value=0
        )
        if  len(cart_matrix) > 2:

            cart_similarity = cosine_similarity(cart_matrix)

            cart_similarity_df = pd.DataFrame(
                cart_similarity,
                index=cart_matrix.index,
                columns=cart_matrix.index
        )
            if user_id in cart_similarity_df.index:

                cart_similar_users = (
                    cart_similarity_df.loc[user_id]
                    .drop(user_id)
                    
                )

                cart_similar_users = cart_similar_users[
                    cart_similar_users > 0
                ]

                print("========== CART SIMILAR USERS ==========")
                print(cart_similar_users)
                print("========================================")
            else:
                cart_similar_users = pd.Series(dtype=float)

        else:
            cart_similar_users = pd.Series(dtype=float)

    else:
        cart_similar_users = pd.Series(dtype=float)

    # -----------------------------
    # Generate Recommendations
    # -----------------------------
    selected = df[df["title"].str.lower() == title.lower()]
    if selected.empty:
        raise HTTPException(status_code=404, detail="Book not found")

    # Get the genre of the selected book
    selected_book_genre = selected.iloc[0]["genre"]

    book_index = selected.index[0]

    scores = list(enumerate(similarity[book_index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)


    recommendations = []

    for i, content_score in scores[1:]:

        book = df.iloc[i]

        # Skip books already in cart
        if int(book["id"]) in cart_books:
            continue

        # ==========================================================
        # 1. CART COLLABORATIVE SCORE
        # ==========================================================

        cart_score = 0.0

        if (
            user_id in cart_similarity_df.index
            and book["id"] in cart_matrix.columns
        ):

            # Get users similar to current user based on cart activity
            cart_similar_users = (
                cart_similarity_df.loc[user_id]
                .drop(user_id)
            )

            # Only positive similarities
            cart_similar_users = cart_similar_users[
                cart_similar_users > 0
            ]

            if not cart_similar_users.empty:

                book_cart_activity = cart_matrix.loc[
                    cart_similar_users.index,
                    book["id"]
                ]

                total_similarity = cart_similar_users.sum()

                if total_similarity > 0:

                    cart_score = (
                        (
                            cart_similar_users
                            * book_cart_activity
                        ).sum()
                        / total_similarity
                    )

        # ==========================================================
        # 2. REVIEW COLLABORATIVE SCORE
        # ==========================================================

        weighted_rating = 0.0
        total_review_similarity = 0.0

        if not review_similar_users.empty:

            for other_user, similarity_value in review_similar_users.items():

                user_rating = reviews_df[
                    (reviews_df["user_email"] == other_user)
                    &
                    (reviews_df["book_id"] == book["id"])
                ]

                if not user_rating.empty:

                    weighted_rating += (
                        similarity_value
                        * user_rating.iloc[0]["rating"]
                    )

                    total_review_similarity += similarity_value

        collaborative_score = 0.0

        if total_review_similarity > 0:

            collaborative_score = (
                weighted_rating
                / total_review_similarity
            ) / 5

        # ==========================================================
        # 3. CONTENT SCORE
        # ==========================================================

        content_score = float(content_score)

        # ==========================================================
        # 4. GENRE PREFERENCE SCORE
        # ==========================================================

        genre_score = (
        1.0
        if str(book["genre"]).strip().lower()
        == str(selected_book_genre).strip().lower()
        else 0.0
    )
        
         #Give an additional preference if the genre is also
        # one of the user's favorite genres.

        favorite_genre_score = (
            1.0
            if str(book["genre"]).strip().lower() in [str(genre).strip().lower() for genre in favorite_genres]
            else 0.0
            )

        # ==========================================================
        # 5. POPULARITY SCORE
        # ==========================================================

        popularity_score = (
            book["normalized_avg_rating"] * 0.3
            +
            book["normalized_review_count"] * 0.1
            +
            book["normalized_cart_count"] * 0.1
        )

        # ==========================================================
        # 6. FINAL HYBRID SCORE
        # ==========================================================

        final_score = (
            content_score * 0.50
            +
            genre_score * 0.20
            +
            favorite_genre_score * 0.10
            +
            popularity_score * 0.05
            +
            collaborative_score * 0.10
            +
            cart_score * 0.05
        )

        print(
            book["title"],
            "content:", round(content_score, 3),
            "genre:", genre_score,
            "favorite_genre:", favorite_genre_score,
            "popularity:", round(popularity_score, 3),
            "collaborative:", round(collaborative_score, 3),
            "cart:", round(cart_score, 3),
            "FINAL:", round(final_score, 3)
        )
        # Determine understandable reason for presentation/evaluation
        if collaborative_score > 0.15:
            reason = "Recommended by readers with similar taste"
        elif genre_score > 0 and content_score > 0.2:
            reason = f"High plot & {book['genre']} match"
        elif favorite_genre_score > 0:
            reason = f"Matches your preferred {book['genre']} genre"
        else:
            reason = "Popular choice among readers"

        # Calculate a match percentage for UI
        display_pct = round(final_score * 100)
        display_pct = min(100, max(0, display_pct))

        recommendations.append({
            "id": int(book["id"]),
            "title": book["title"],
            "author": book["author"],
            "genre": book["genre"],
            "price": float(book.get("price") or 0),
            "cover": book.get("cover") or "",
            "avg_rating": round(
                float(book["actual_avg_rating"]),
                1
            ),
            "recommendation_score": round(final_score, 3),
            "match_percentage": display_pct,
            "reason": reason,
        })
        recommendations.sort(
            key=lambda x: x["recommendation_score"],
            reverse=True
        )

    return {"recommendations": recommendations[:5]}