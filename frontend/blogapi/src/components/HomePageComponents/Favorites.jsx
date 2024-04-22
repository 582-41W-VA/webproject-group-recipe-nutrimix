import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Logo from './Logo';
import UserControl from './UserControl';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favoritePosts, setFavoritePosts] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage.');
                    return;
                }
                const config = {
                    headers: {
                        'Authorization': `JWT ${accessToken}`,
                    }
                };
                const response = await axios.get('http://127.0.0.1:8000/api/bookmarks/', config);
                setFavorites(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching favorites. Please try again later.');
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        const fetchFavoritePosts = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage.');
                    return;
                }
                const config = {
                    headers: {
                        'Authorization': `JWT ${accessToken}`,
                    }
                };
                // const posts = [];
                // for (const postId of postIds) {
                //     try {
                //         const response = await axios.get(`http://127.0.0.1:8000/api/${postId}/`);
                //         posts.push(response.data);
                const postIds = favorites.map(favorite => favorite.post);//favorites.post == recipe.id
                const posts = await Promise.all(postIds.map(async postId => {
                    const response = await axios.get(`http://127.0.0.1:8000/api/${postId}/`);
                    return response.data;
                }));
                setFavoritePosts(posts);//favoritePosts
            } catch (error) {
                console.error('Error fetching favorite posts:', error);
            }
        };

        fetchFavoritePosts();
    }, [favorites]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!Array.isArray(favoritePosts) || favoritePosts.length === 0) {
        return <div>No favorites found.</div>;
    }

    return (
        <div className="all-container">
            <header className="header-flex" >
                <Logo />
                <UserControl />
            </header>
            <div style={{ borderBottom: '0.5px solid #CCCCCC', marginTop: '3%', marginBottom: '3%' }}></div>
            <h2>Recipes Collected</h2>
            <div className="recipe-listuser">
                {favoritePosts.map((post) => (
                    <div key={post.id} className="recipe-card">
                        <Link to={`/recipe/${post.id}`} className="recipe-link">
                            {post.image && <img src={post.image} alt={post.title} />}
                            <h3>{post.title}</h3>
                            <p>{post.author}</p>
                        </Link>
                    </div>
                ))}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Favorites;
