import React, { useState, useEffect, useRef } from 'react';
import {
    Layout,
    Button,
    Modal,
    message,
    Card,
    Form,
    Input,
    Select,
    Spin,
    Image,
    Typography,
    Space,
    Divider,
    Table,
    Popconfirm
} from 'antd';
import {
    PlusOutlined,
    CloseOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import Sidebar from '../components/ui/Sidebar';
import { Home, Users, Clock, ListChecks, PawPrint, Shield, FileText } from "lucide-react";

const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AdminBlogs = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const fileInputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                console.log('Fetching blogs...');
                const response = await fetch('http://localhost:3000/api/blogs');
                const data = await response.json();
                console.log('Blogs fetched successfully:', data);
                setBlogs(data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                message.error('Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleImageUpload = async (file) => {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            console.log('Uploading image to Cloudinary...');
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            console.log('Image uploaded successfully:', data.secure_url);
            setImagePreview(data.secure_url);
            form.setFieldsValue({ image: data.secure_url });
            message.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            message.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            message.error('You can only upload image files!');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error('Image must be smaller than 5MB!');
            return;
        }

        setImageFile(file);
        handleImageUpload(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        form.setFieldsValue({ image: '' });
    };

    const handleCreateBlog = async (values) => {
        console.log('Submitting blog form with values:', values);

        if (!values.image) {
            message.error('Please upload an image for the blog');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:3000/api/blogs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            console.log('Server response:', response);

            if (!response.ok) {
                throw new Error('Failed to create blog');
            }

            const newBlog = await response.json();
            console.log('Blog created successfully:', newBlog);

            setBlogs([newBlog, ...blogs]);
            message.success('Blog created successfully!');
            setVisible(false);
            form.resetFields();
            setImageFile(null);
            setImagePreview('');
        } catch (error) {
            console.error('Error creating blog:', error);
            message.error('Failed to create blog');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/blogs/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }

            setBlogs(blogs.filter(blog => blog._id !== id));
            message.success('Blog deleted successfully!');
        } catch (error) {
            console.error('Error deleting blog:', error);
            message.error('Failed to delete blog');
        }
    };

    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setViewModalVisible(true);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <Image
                    src={image}
                    alt="Blog"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                    preview={false}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            sorter: (a, b) => a.author?.localeCompare(b.author),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: [
                { text: 'Adoption Stories', value: 'Adoption Stories' },
                { text: 'Pet Care', value: 'Pet Care' },
                { text: 'Health Tips', value: 'Health Tips' },
                { text: 'Success Stories', value: 'Success Stories' },
            ],
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewBlog(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this blog?"
                        onConfirm={() => handleDeleteBlog(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const adminMenuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: Home },
        { path: "/admin/manage-users", label: "Manage Users", icon: Users },
        { path: "/admin/pending-vendors", label: "Pending Applications", icon: Clock },
        { path: "/admin/manage-vendors", label: "All Applications", icon: ListChecks },
        { path: "/admin/all-pets", label: "All Pets", icon: PawPrint },
        { path: "/admin/all-admins", label: "All Admins", icon: Shield },
        { path: "/admin/all-adoptions", label: "All Adoptions", icon: Shield },
        { path: "/admin/manage-blogs", label: "Manage Blog", icon: FileText }
    ];

    return (
        <div className="flex">

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                menuItems={adminMenuItems}
                title="Admin Panel"
            />
            <Layout>
                <Header className="bg-white p-0 px-6 shadow-sm" style={{ padding: 2 }}>
                    <div className="flex justify-between items-center h-full">
                        <Title level={3} className="m-3">Manage Blogs</Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setVisible(true)}
                            className="flex items-center"
                        >
                            Add Blog
                        </Button>
                    </div>
                </Header>

                <Content className="p-6" style={{ minHeight: 'calc(100vh - 64px)' }}>
                    {loading ? (
                        <div className="text-center py-12">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto">
                            <Card>
                                <Table
                                    columns={columns}
                                    dataSource={blogs}
                                    rowKey="_id"
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ x: true }}
                                />
                            </Card>
                        </div>
                    )}
                </Content>
            </Layout>

            {/* Create Blog Modal */}
            <Modal
                title="Create New Blog"
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                    setImageFile(null);
                    setImagePreview('');
                }}
                footer={[
                    <Button key="back" onClick={() => setVisible(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={submitting}
                        onClick={() => form.submit()}
                    >
                        Submit
                    </Button>,
                ]}
                className="rounded-lg"
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateBlog}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            { required: true, message: 'Please input the blog title!' },
                            { max: 100, message: 'Title cannot exceed 100 characters' }
                        ]}
                    >
                        <Input placeholder="Enter blog title" className="rounded" />
                    </Form.Item>

                    <Form.Item
                        name="author"
                        label="Author Name"
                        rules={[
                            { required: true, message: 'Please input the author name!' },
                            { max: 50, message: 'Author name cannot exceed 50 characters' }
                        ]}
                    >
                        <Input placeholder="Enter author name" className="rounded" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a category" className="rounded">
                            <Option value="Adoption Stories">Adoption Stories</Option>
                            <Option value="Pet Care">Pet Care</Option>
                            <Option value="Health Tips">Health Tips</Option>
                            <Option value="Success Stories">Success Stories</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Blog Image"
                        rules={[{ required: true, message: 'Please upload an image!' }]}
                    >
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploadingImage}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <Button
                                type="dashed"
                                block
                                loading={uploadingImage}
                                className="rounded"
                                onClick={handleButtonClick}
                            >
                                {uploadingImage ? 'Uploading...' : 'Click to Upload Image'}
                            </Button>
                            {uploadingImage && (
                                <div className="mt-2">
                                    <Spin tip="Uploading image..." />
                                </div>
                            )}
                            {imagePreview && (
                                <div className="mt-4 relative" style={{ width: '100px' }}>
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        width={100}
                                        height={100}
                                        className="rounded"
                                    />
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={removeImage}
                                        className="absolute top-0 right-0"
                                        style={{ color: 'red' }}
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please input the blog content!' }]}
                    >
                        <TextArea rows={6} placeholder="Enter blog content" className="rounded" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* View Blog Modal */}
            <Modal
                title={selectedBlog?.title}
                visible={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={800}
            >
                {selectedBlog && (
                    <div>
                        <Image
                            src={selectedBlog.image}
                            alt={selectedBlog.title}
                            width="50%"
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                            preview={false}
                        />
                        <Divider />
                        <div className="flex justify-between mb-4">
                            <div>
                                <span className="text-gray-500">Author: {selectedBlog.author}</span>
                                <br />
                                <span className="text-gray-500">Category: {selectedBlog.category}</span>
                            </div>
                            <span className="text-gray-500">
                                Created: {new Date(selectedBlog.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <Paragraph>{selectedBlog.content}</Paragraph>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminBlogs;