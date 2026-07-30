from fastapi import APIRouter, HTTPException
from database.supabase_client import supabase
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
router = APIRouter()

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
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    favorite_genres = profile.data.get("favorite_genres", [])
    user_id = profile.data["id"]

    if not favorite_genres:
        raise HTTPException(
            status_code=404,
            detail="No favorite genres selected"
        )


    # Get reviewed books
    reviews = (
        supabase.table("reviews")
        .select("book_id")
        .eq("user_email", email)
        .execute()
    )

    reviewed_books = []

    if reviews.data:
        reviewed_books = [
            int(r["book_id"])
            for r in reviews.data
        ]


    # Get cart books
    cart = (
        supabase.table("cart")
        .select("book_id")
        .eq("user_id", user_id)
        .execute()
    )

    cart_books = []

    if cart.data:
        cart_books = [
            int(c["book_id"])
            for c in cart.data
        ]


    # Get books
    books = (
        supabase.table("books")
        .select("*")
        .execute()
    )


    recommendations = []


    for book in books.data:

        # Only favorite genres
        if book["genre"] not in favorite_genres:
            continue


        # Skip already reviewed books
        if int(book["id"]) in reviewed_books:
            continue


        # Skip cart books
        if int(book["id"]) in cart_books:
            continue


        recommendations.append({
            "id": book["id"],
            "title": book["title"],
            "author": book["author"],
            "genre": book["genre"],
            "similarity": 0.5
        })

    if len(recommendations) < 5:

        popular_books = (
            supabase.table("books")
            .select("*")
            .order("rating", desc=True)
            .limit(10)
            .execute()
        )

        for book in popular_books.data:

            if int(book["id"]) in reviewed_books:
                continue

            if int(book["id"]) in cart_books:
                continue

            # Skip books already recommended
            if any(r["id"] == book["id"] for r in recommendations):
                continue


            recommendations.append({
                "id": book["id"],
                "title": book["title"],
                "author": book["author"],
                "genre": book["genre"],
                "similarity": 1.0
            })

    return {
        "recommendations": recommendations[:10]
    }

@router.get("/recommend/{email}/{title}")
def recommend_books(email: str, title: str):

    # Fetch all books
    result = supabase.table("books").select("*").execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No books found")

    df = pd.DataFrame(result.data)

    # Fetch all reviews
    reviews_result = supabase.table("reviews").select("*").execute()

    reviews_df = pd.DataFrame(reviews_result.data)

    # Fetch cart
    cart_result = (
        supabase.table("cart")
        .select("*")
        .execute()
    )

    cart_df = pd.DataFrame(cart_result.data)


    if reviews_df.empty:
        reviews_df = pd.DataFrame(
            columns=["user_email", "book_id", "rating"]
        )   
    if cart_df.empty:
        cart_df = pd.DataFrame(
            columns=["user_id", "book_id", "quantity"]
        )

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

    df = df.merge(
        rating_avg,
        left_on="id",
        right_on="book_id",
        how="left"
    ).drop(columns=["book_id"])

    df = df.merge(
        rating_count,
        left_on="id",
        right_on="book_id",
        how="left"
    ).drop(columns=["book_id"])

    df = df.merge(
        cart_count,
        left_on="id",
        right_on="book_id",
        how="left"
    ).drop(columns=["book_id"])

    df["avg_rating"] = df["avg_rating"].fillna(0)
    df["review_count"] = df["review_count"].fillna(0)
    df["cart_count"] = df["cart_count"].fillna(0)

    scaler = MinMaxScaler()

    df[
        ["avg_rating", "review_count", "cart_count"]
        ] = scaler.fit_transform(
            df[
                ["avg_rating", "review_count", "cart_count"]
            ]
        )
    # Make sure these columns exist
    required_columns = ["title", "author", "genre", "description"]

    for col in required_columns:
        if col not in df.columns:
            df[col] = ""

    # Combine text
    df["content"] = (
        df["title"].fillna("") + " " +
        df["author"].fillna("") + " " +
        df["genre"].fillna("") + " " +
        df["description"].fillna("")
    )

    # TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english")

    tfidf_matrix = vectorizer.fit_transform(df["content"])

    # Cosine Similarity
    similarity = cosine_similarity(tfidf_matrix)
    try:
        profile = (
            supabase.table("profiles")
            .select("id, favorite_genres")
            .eq("email", email)
            .single()
            .execute()
        )
    except Exception:
         profile =  None

    favorite_genres = []
    user_id = None
    similar_users = pd.Series(dtype=float)
    cart_similarity_df = pd.DataFrame()
    

    if not profile or not profile.data:
        raise HTTPException(
        status_code=404,
        detail="Profile not found"
    )
    favorite_genres = profile.data.get("favorite_genres", [])
    user_id=profile.data["id"]
        

    user_reviews = reviews_df[
        reviews_df["user_email"] == email
        ]
    reviewed_books=user_reviews["book_id"].tolist()

    user_cart = cart_df[
            cart_df["user_id"] == user_id
        ]
    cart_books=user_cart["book_id"].tolist()    
               
    # Find selected book
    if user_reviews.empty and user_cart.empty:

            df["popularity"] = (
                df["avg_rating"] * 0.6 +
                df["review_count"] * 0.2 +
                df["cart_count"] * 0.2
            )

            if favorite_genres:
                df = df[df["genre"].isin(favorite_genres)]

            df = df.sort_values(
                "popularity",
                ascending=False
            )

            return {
                "recommendations": df[
                    ["id","title","author","genre"]
                ].head(5).to_dict("records")
            }
    
        # -----------------------------
        # Collaborative Filtering
        # -----------------------------

    if not reviews_df.empty:

            rating_matrix = reviews_df.pivot_table(
                index="user_email",
                columns="book_id",
                values="rating"
            )

            user_similarity = cosine_similarity(
                rating_matrix.fillna(0)
            )

            similarity_df = pd.DataFrame(
                user_similarity,
                index=rating_matrix.index,
                columns=rating_matrix.index
            )

            if email in similarity_df.index:

                similar_users = (
                    similarity_df[email]
                    .sort_values(ascending=False)
                    .drop(email)
                )

    else:

            similar_users = pd.Series(dtype=float)

        # -----------------------------
        # Cart Collaborative Filtering
        # -----------------------------

    if not cart_df.empty:

                cart_matrix = cart_df.pivot_table(
                    index="user_id",
                    columns="book_id",
                    aggfunc="size",
                    fill_value=0
                )

                cart_similarity = cosine_similarity(cart_matrix)

                cart_similarity_df = pd.DataFrame(
                    cart_similarity,
                    index=cart_matrix.index,
                    columns=cart_matrix.index
                )

    else:
                cart_similarity_df = pd.DataFrame()


        # -----------------------------
        # Generate Recommendations
        # -----------------------------

    selected = df[
            df["title"].str.lower() == title.lower()
        ]

    if selected.empty:
            raise HTTPException(
                status_code=404,
                detail="Book not found"
            )


    book_index = selected.index[0]


    scores = list(
            enumerate(similarity[book_index])
        )


    scores = sorted(
            scores,
            key=lambda x:x[1],
            reverse=True
        )


    recommendations = []

    similar_cart_users=pd.Series(dtype=float)
    if(
         user_id is not None
         and not cart_similarity_df.empty
         and user_id in cart_similarity_df.index
    ):
         similar_cart_users=(
              cart_similarity_df.loc[user_id]
              .drop(user_id)
              .sort_values(ascending=False)
         )

    for i, content_score in scores[1:]:

            book = df.iloc[i]
            collaborative_score = 0
            cart_score = 0
            if not similar_cart_users.empty:

                total_cart_similarity = 0

                for other_user, similarity_value in similar_cart_users.items():

                    cart_book = cart_df[
                        (cart_df["user_id"] == other_user) &
                        (cart_df["book_id"] == book["id"])
                    ]

                    if not cart_book.empty:
                        cart_score += similarity_value
                        total_cart_similarity += similarity_value

                if total_cart_similarity > 0:
                    cart_score /= total_cart_similarity
                        

    # -----------------------------
    # Review Collaborative Score
    # -----------------------------
            weighted_rating = 0
            total_review_similarity = 0

            if not similar_users.empty:
                 for other_user,similarity_value in similar_users.items():
                      
                      user_rating =reviews_df[
                           (reviews_df["user_email"]== other_user)&
                           (reviews_df["book_id"]==book["id"])
                      ]
                      if not user_rating.empty:
                             weighted_rating += (
                                  similarity_value*
                                  user_rating.iloc[0]["rating"]
                             )
                           
                             total_review_similarity += similarity_value

            if total_review_similarity > 0:
                 collaborative_score =(
                      weighted_rating/
                      total_review_similarity
                 )/5
            else:
                 collaborative_score = 0
                                    
                           


            # skip already viewed/reviewed/cart
            if int(book["id"]) in reviewed_books:
                continue

            if int(book["id"]) in cart_books:
                continue


            # Content score
            content_score = float(content_score)


            # Genre preference
            genre_score = 0

            if book["genre"] in favorite_genres:
                genre_score = 0.2


            # Popularity
            popularity_score = (
                book["avg_rating"] * 0.3 +
                book["review_count"] * 0.1 +
                book["cart_count"] * 0.1
            )


            final_score = (
                content_score * 0.35+
                genre_score* 0.15 +
                popularity_score * 0.15+
                collaborative_score * 0.20+
                cart_score * 0.15          
            )


            recommendations.append({

                "id": int(book["id"]),
                "title": book["title"],
                "author": book["author"],
                "genre": book["genre"],
                "similarity": round(final_score,2)

            })


    recommendations.sort(
            key=lambda x:x["similarity"],
            reverse=True
        )

    if len(recommendations) == 0:

        fallback = (
            df.sort_values(
                "avg_rating",
                ascending=False
            )
            [["id","title","author","genre"]]
            .head(5)
            .to_dict("records")
        )

        return {
            "recommendations": fallback
        }

    return {
            "recommendations": recommendations[:5]
        }