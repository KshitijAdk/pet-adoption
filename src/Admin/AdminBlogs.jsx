import React, { useState, useEffect } from 'react';
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
    Divider
} from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
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

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                console.log('Fetching blogs...');
                const response = await fetch('http://localhost:5000/api/blogs/all');
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
        formData.append('upload_preset', 'your_cloudinary_upload_preset'); // Replace with your upload preset

        try {
            console.log('Uploading image to Cloudinary...');
            const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
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

        // Validate file type and size
        if (!file.type.match('image.*')) {
            message.error('You can only upload image files!');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
            const response = await fetch('http://localhost:5000/api/blogs/create', {
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

    return (
        <Layout className="min-h-screen">
            <Header className="bg-white p-0 px-6 shadow-sm">
                <div className="flex justify-between items-center h-full">
                    <Title level={3} className="m-0">Blog Dashboard</Title>
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
                        {blogs.length === 0 ? (
                            <Card className="w-full">
                                <Paragraph type="secondary">No blogs found. Create your first blog!</Paragraph>
                            </Card>
                        ) : (
                            <Space direction="vertical" size="large" className="w-full">
                                {blogs.map(blog => (
                                    <Card
                                        key={blog._id}
                                        hoverable
                                        className="w-full mb-4 rounded-lg overflow-hidden"
                                        cover={
                                            <Image
                                                alt={blog.title}
                                                src={blog.image}
                                                preview={false}
                                                className="max-h-80 object-cover"
                                            />
                                        }
                                    >
                                        <Title level={4}>{blog.title}</Title>
                                        <Paragraph type="secondary" strong>{blog.category}</Paragraph>
                                        <Divider className="my-4" />
                                        <Paragraph>{blog.content}</Paragraph>
                                    </Card>
                                ))}
                            </Space>
                        )}
                    </div>
                )}
            </Content>

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
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    type="dashed"
                                    block
                                    loading={uploadingImage}
                                    className="rounded"
                                >
                                    {uploadingImage ? 'Uploading...' : 'Click to Upload Image'}
                                </Button>
                            </label>
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
        </Layout>
    );
};

export default AdminBlogs;