import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Config/api';
import { FaRegClock, FaRegUser, FaRegHeart, FaRegEye, FaRegComment } from 'react-icons/fa';
import '../Styles/BlogDetail.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [lengthCart, setLengthCart] = useState(0);
    const [viewIncremented, setViewIncremented] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchBlog();
                await fetchCartLength();
                await checkAuth();

                if (!viewIncremented) {
                    await axios.post(`/api/blogs/${id}/views`);
                    setViewIncremented(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, viewIncremented]);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth');
            if (response.data) {
                setIsAuthenticated(true);
                setCurrentUser(response.data);
            } else {
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
    };

    const fetchCartLength = async () => {
        try {
            const response = await axios.get('/api/cart');
            setLengthCart(response.data.length);
        } catch (error) {
            console.error('Error fetching cart length:', error);
        }
    };

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blogs/${id}`);
            setBlog(response.data);
            setIsLiked(response.data.likedBy?.includes(response.data.currentUserEmail));
            setError(null);
        } catch (err) {
            setError('Failed to fetch blog');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/blogs/${id}/like`);
            setBlog((prev) => ({
                ...prev,
                likes: response.data.likes,
            }));
            setIsLiked(true);
            toast.success('Đã thích bài viết!');
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Có lỗi xảy ra khi thích bài viết');
            }
            console.error(err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để bình luận');
            navigate('/login');
            return;
        }

        if (!comment.trim()) {
            toast.error('Vui lòng nhập nội dung bình luận');
            return;
        }

        try {
            const response = await axios.post(
                `/api/blogs/${id}/comments`,
                {
                    content: comment.trim(),
                },
                {
                    withCredentials: true, // Thêm option này để gửi cookie
                },
            );

            if (response.data) {
                toast.success('Đã thêm bình luận thành công!');
                setComment('');
                await fetchBlog(); // Refresh để lấy comment mới
            }
        } catch (err) {
            console.error('Error posting comment:', err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Có lỗi xảy ra khi đăng bình luận');
            }
        }
    };

    if (loading)
        return (
            <>
                <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
                <div className="loading">Loading...</div>
                <Footer />
            </>
        );

    if (error)
        return (
            <>
                <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
                <div className="error">{error}</div>
                <Footer />
            </>
        );

    if (!blog)
        return (
            <>
                <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
                <div className="error">Blog not found</div>
                <Footer />
            </>
        );

    return (
        <>
            <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
            <ToastContainer />
            <div className="blog-detail-container">
                <div className="blog-header">
                    <div className="blog-category">{blog.category}</div>
                    <h1>{blog.title}</h1>
                    <div className="blog-meta">
                        <span>
                            <FaRegUser /> {blog.author}
                        </span>
                        <span>
                            <FaRegClock /> {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                            <FaRegEye /> {blog.views}
                        </span>
                        <span>
                            <FaRegHeart className={isLiked ? 'liked' : ''} /> {blog.likes}
                        </span>
                    </div>
                </div>
                <div className="blog-image">
                    <img src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-content">
                    <div className="blog-excerpt">{blog.excerpt}</div>
                    <div className="blog-body">{blog.content}</div>
                </div>
                <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="blog-actions">
                    <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        <FaRegHeart /> Like
                    </button>
                </div>
                <div className="comments-section">
                    <h2>Bình luận</h2>
                    {isAuthenticated ? (
                        <form onSubmit={handleComment} className="comment-form">
                            <textarea
                                placeholder="Viết bình luận của bạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                            <button type="submit">Đăng bình luận</button>
                        </form>
                    ) : (
                        <div className="login-prompt">
                            <p>
                                Vui lòng <button onClick={() => navigate('/login')}>đăng nhập</button> để bình luận
                            </p>
                        </div>
                    )}
                    <div className="comments-list">
                        {blog.comments && blog.comments.length > 0 ? (
                            blog.comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.author}</span>
                                        <span className="comment-date">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="comment-content">{comment.content}</div>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogDetail;
