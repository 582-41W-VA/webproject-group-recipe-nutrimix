import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../css/RecipeDetail.css";
import UserControl from '../components/HomePageComponents/UserControl';
import Footer from '../components/HomePageComponents/Footer';
import Logo from '../components/HomePageComponents/Logo';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, Star, StarBorder } from '@mui/icons-material';

const RecipeDetail = () => {
const { recipeId } = useParams();
const [post, setPost] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [comment, setComment] = useState('');
const [comments, setComments] = useState([]);
const [likes, setLikes] = useState(1);
const [isLiked, setIsLiked] = useState(false);
const [isBookmarked, setIsBookmarked] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
const accessToken = localStorage.getItem('access_token');
if (accessToken) {
setIsLoggedIn(true);
}

if (!recipeId) return;
const fetchPost = async () => {
try {
const response = await axios.get(`http://127.0.0.1:8000/api/${recipeId}/`);
setPost(response.data);
setLikes(response.data.likes);
setIsLiked(response.data.isLiked);
setIsBookmarked(response.data.isBookmarked);
setLoading(false);
} catch (error) {
setError('Error fetching recipe details. Please try again later.');
setLoading(false);
}
};

fetchPost();

const fetchComments = async () => {
try {
const response = await axios.get(`http://127.0.0.1:8000/api/posts/${recipeId}/comments/`);
setComments(response.data);
} catch (error) {
console.error('Error fetching comments:', error);
}
};

fetchComments();

const fetchBookmarkInfo = async () => {
try {
if (!accessToken) {
console.error('Access token not found in local storage.');
return;
}
const config = {
headers: {
'Authorization': `JWT ${accessToken}`,
}
};
const response = await axios.get(`http://127.0.0.1:8000/api/posts/${recipeId}/bookmarks/`, config);
setIsBookmarked(response.data.is_bookmarked);
} catch (error) {
console.error('Error fetching bookmark info:', error);
}
};

fetchBookmarkInfo();
}, [recipeId]);

const handleCommentChange = (e) => {
setComment(e.target.value);
};

const handleSubmitComment = async () => {
try {
const accessToken = localStorage.getItem('access_token');
if (!accessToken) {
console.error('Access token not found in local storage.');
return;
}
const config = {
headers: {
'Authorization': `JWT ${localStorage.getItem('access_token')}`,
}
};

const response = await axios.post(`http://127.0.0.1:8000/api/posts/${recipeId}/comments/`, { post: recipeId, content: comment }, config);
setComments(prevComments => {
if (!Array.isArray(prevComments)) {
return [response.data];
}
return [...prevComments, response.data];
});
setComment('');
} catch (error) {
console.error('Error submitting comment:', error);
}
};

const handleLike = async () => {
try {
if (isLiked) {
await axios.delete(`http://127.0.0.1:8000/api/posts/${recipeId}/like/`);
setLikes(likes - 1);
} else {
await axios.post(`http://127.0.0.1:8000/api/posts/${recipeId}/like/`, { post: recipeId });
setLikes(likes + 1);
}
} catch (error) {
console.error('Error toggling like:', error);
}
// Toggle the isLiked state immediately after the user clicks
setIsLiked(!isLiked);
};

const handleBookmark = async () => {
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

if (!isBookmarked) {
await axios.post(`http://127.0.0.1:8000/api/posts/${recipeId}/bookmark/`, null, config);
setIsBookmarked(true);
} else {
await axios.delete(`http://127.0.0.1:8000/api/posts/${recipeId}/bookmark/`, config);
setIsBookmarked(false);
}
} catch (error) {
console.error('Error toggling bookmark:', error);
}
};

if (loading) {
return <div>Loading...</div>;
}

if (error) {
return <div>{error}</div>;
}

return (
<div key={post.id} className="all-container">
<header className="header-flex">
<Logo></Logo>
<UserControl />
</header>
<div style={{ borderBottom: '0.5px solid #CCCCCC', marginTop: '3%', marginBottom: '3%' }}></div>

<article>
{post.image && <img src={post.image} alt={post.title} />}
<div>
<Tooltip title="Like">
<IconButton onClick={handleLike} color={isLiked ? 'secondary' : 'default'}>
{isLiked ? <Favorite style={{ color: isLiked ? '#F1BD22' : 'inherit' }} /> : <FavoriteBorder />}
</IconButton>
</Tooltip>

<Tooltip title="Collect">
{isLoggedIn ? (
<IconButton onClick={handleBookmark} color={isBookmarked ? 'secondary' : 'default'}>
{isBookmarked ? <Star style={{ color: isBookmarked ? '#F1BD22' : 'inherit' }} /> : <StarBorder />}
</IconButton>
) : (
<span>
<Tooltip title="Login to bookmark">
<IconButton color="default" disabled>
<StarBorder />
</IconButton>
</Tooltip>
</span>
)}
</Tooltip>
</div>
<h2>{post.title}</h2>
<p style={{color:'#555'}}>By: {post.author}</p>
<p style={{maxWidth:'80%'}}>{post.excerpt}</p>
{/* <p>{post.content}</p> */}
<h3>Ingredients:</h3>
<p>{post.ingredient}</p>
<div style={{ fontSize: '16px', lineHeight: '1.5' }}>
<h3>Steps:</h3>
<div><p>{post.content.split('\n').map((item, key) => {
return <span key={key}>{item}<br /></span>
})}</p></div>
</div>
{/* Display max cooking time */}
<h3>Max Cooking Time:</h3>
<p>{post.max_cooking_time} minutes</p>

<div>
{isLoggedIn ? (
<textarea
value={comment}
onChange={handleCommentChange}
rows={4}
cols={50}
placeholder="Enter your comment..."
/>
) : (
<span>
<Tooltip title="Login to comment">
<textarea
value={comment}
onChange={handleCommentChange}
rows={4}
cols={50}
placeholder="Login to comment"
disabled
/>
</Tooltip>
</span>
)}
</div>
<div>
{isLoggedIn ? (
<button 
onClick={handleSubmitComment} 
style={{ 
border: '2px solid #559E34', 
backgroundColor: 'transparent', 
color: '#559E34',
cursor: 'pointer',
transition: 'background-color 0.3s',
padding: '8px 16px', // Adjust padding as needed
borderRadius: '4px', // Add border radius for rounded corners
outline: 'none', // Remove default focus outline
}}
onMouseOver={(e) => { e.target.style.backgroundColor = '#559E34'; e.target.style.color = '#FFF'; }}
onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#559E34'; }}
>
Submit
</button>
) : (
<Tooltip title="Login to comment">
<button 
disabled 
style={{ 
border: '2px solid #559E34', 
backgroundColor: 'transparent', 
color: '#559E34',
cursor: 'not-allowed',
padding: '8px 16px', // Adjust padding as needed
borderRadius: '4px', // Add border radius for rounded corners
outline: 'none', // Remove default focus outline
}}
>
Submit
</button>
</Tooltip>
)}

</div>

<h3>Previous Comments:</h3>
<ul>
{comments.map((comment, index) => (
<li key={index} style={{ marginBottom: '8px' }}>
<strong>{comment.author}: </strong>{comment.content}
</li>
))}
</ul>
</article>

<Footer></Footer>
</div>
);
};

export default RecipeDetail;
