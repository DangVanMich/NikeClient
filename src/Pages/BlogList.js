import React, { useState, useEffect } from 'react';
import axios from '../Config/api';
import BlogCard from '../Components/BlogCard';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Styles/BlogList.css';
import useDebounce from '../hooks/useDebounce';

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [lengthCart, setLengthCart] = useState(0);

    const debouncedSearch = useDebounce(search, 800);

    const categories = [
        'Chăm sóc giày',
        'Xu hướng thời trang',
        'Câu chuyện thương hiệu',
        'Hướng dẫn phong cách',
        'Văn hóa sneaker',
        'Thể thao & Hiệu suất',
        'Mẹo mua sắm',
    ];

    useEffect(() => {
        fetchBlogs();
        fetchCartLength();
    }, [page, category, debouncedSearch]);

    const fetchCartLength = async () => {
        try {
            const response = await axios.get('/api/cart');
            setLengthCart(response.data.length);
        } catch (error) {
            console.error('Error fetching cart length:', error);
        }
    };

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blogs`, {
                params: {
                    page,
                    limit: 9,
                    category,
                    search: debouncedSearch,
                },
            });
            if (response.data && response.data.blogs) {
                setBlogs(response.data.blogs);
                setTotalPages(response.data.totalPages);
                setError(null);
            } else {
                setError('Invalid response format from server');
                console.error('Invalid response format:', response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch blogs. Please try again later.');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <Header lengthCart={lengthCart} setLengthCart={setLengthCart} />
            <div className="blog-hero">
                <div className="blog-hero-content">
                    <h1>Khám Phá Thế Giới Giày</h1>
                    <p>Cập nhật xu hướng, kiến thức và cảm hứng về giày thể thao</p>
                </div>
            </div>
            <div className="blog-list-container">
                <div className="blog-header">
                    <h2>Bài Viết Mới Nhất</h2>
                    <div className="blog-filters">
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit">Tìm Kiếm</button>
                        </form>
                        <select value={category} onChange={handleCategoryChange}>
                            <option value="">Tất Cả Danh Mục</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="blog-grid">
                    {blogs.map((blog) => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                            Trang Trước
                        </button>
                        <span>
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Trang Sau
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default BlogList;
