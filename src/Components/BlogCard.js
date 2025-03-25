import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock, FaRegUser, FaRegHeart, FaRegEye } from 'react-icons/fa';
import '../Styles/BlogCard.css';

const BlogCard = ({ blog }) => {
    return (
        <div className="blog-card">
            <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
            </div>
            <div className="blog-content">
                <div className="blog-category">{blog.category}</div>
                <h3 className="blog-title">
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-meta">
                    <span>
                        <FaRegUser /> {blog.author}
                    </span>
                    <span>
                        <FaRegClock /> {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                        <FaRegHeart /> {blog.likes}
                    </span>
                    <span>
                        <FaRegEye /> {blog.views}
                    </span>
                </div>
                <div className="blog-tags">
                    {blog.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
