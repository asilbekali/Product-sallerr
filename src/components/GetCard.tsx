import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import type { Product } from '../types/types';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Button, Modal, Dropdown, Menu, Input, Form } from 'antd';
import { motion } from 'framer-motion';
import { API, CHAT_ID, TOKEN } from '../hooks/getEnv';

const GetCard = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.orderList);

    const [form] = Form.useForm();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ Telegramga xabar yuborish funksiyasi
    const sendTelegramMessage = async (text: string) => {
        try {
            await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
            });
        } catch (err) {
            console.error("Telegram xatolik:", err);
        }
    };

    // ✅ Mahsulotlarni yuklash (GET)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(API);
                const data = await res.json();
                dispatch({ type: 'get', payload: data });
            } catch (error) {
                console.error("Ma'lumotlarni olishda xatolik:", error);
            }
        };

        fetchProducts();
    }, [dispatch]);

    // ✅ O'chirish
    const handleDelete = async (id: number | string) => {
        dispatch({ type: 'delete', payload: id });
        await sendTelegramMessage(`🗑 *Mahsulot o‘chirildi:* ID ${id}`);
    };

    // ✅ Modalni ochish
    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
        setIsUpdateMode(false);
    };

    // ✅ Tahrirlash
    const handleUpdateClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
        setIsUpdateMode(true);
        form.setFieldsValue({ ...product, images: product.images?.[0] });
    };

    const handleUpdateSubmit = async (values: any) => {
        if (!selectedProduct) return;
        const updated = { ...selectedProduct, ...values, images: [values.images] };
        dispatch({ type: 'update', payload: updated });
        await sendTelegramMessage(`✏️ *Yangilandi:* ${updated.title}`);
        setIsModalVisible(false);
    };

    // ✅ Menu
    const menu = (product: Product) => (
        <Menu>
            <Menu.Item key="1" onClick={() => handleDelete(product.id)}>🗑 O‘chirish</Menu.Item>
            <Menu.Item key="2" onClick={() => handleUpdateClick(product)}>✏️ Tahrirlash</Menu.Item>
        </Menu>
    );

    return (
        <>
            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={!isUpdateMode ? [
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>Bekor qilish</Button>,
                    <Button
                        key="buy"
                        type="primary"
                        loading={loading}
                        onClick={async () => {
                            if (selectedProduct) {
                                setLoading(true);
                                await sendTelegramMessage(`🛒 *Buyurtma:* ${selectedProduct.title} - $${selectedProduct.price}`);
                                setLoading(false);
                                setIsModalVisible(false);
                            }
                        }}
                    >Sotib olish</Button>
                ] : null}
                title={isUpdateMode ? 'Mahsulotni tahrirlash' : selectedProduct?.title}
                centered
            >
                {isUpdateMode ? (
                    <Form form={form} layout="vertical" onFinish={handleUpdateSubmit}>
                        <Form.Item label="Nomi" name="title" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Rasm URL" name="images" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Tavsif" name="description" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
                        <Form.Item label="Narxi" name="price" rules={[{ required: true }]}><Input type="number" /></Form.Item>
                        <Button htmlType="submit" type="primary">Saqlash</Button>
                    </Form>
                ) : (
                    <>
                        <img src={selectedProduct?.images?.[0]} alt={selectedProduct?.title} style={{ width: '100%', borderRadius: '10px' }} />
                        <Typography>{selectedProduct?.description}</Typography>
                        <Typography>💵 ${selectedProduct?.price}</Typography>
                    </>
                )}
            </Modal>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, padding: 20 }}>
                {products.map((product) => (
                    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Card sx={{ width: 280, height: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '20px', boxShadow: 4 }}>
                            <CardActionArea onClick={() => openModal(product)}>
                                <CardMedia component="img" height="180" image={product.images?.[0]} alt={product.title} />
                                <CardContent>
                                    <Typography variant="h6">{product.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</Typography>
                                    <Typography variant="body2" color="green">${product.price}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f3f3f3' }}>
                                <Button type="primary" onClick={() => openModal(product)} size="small">Buy now</Button>
                                <Dropdown overlay={menu(product)} trigger={['click']}><Button size="small">⋯</Button></Dropdown>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </>
    );
};

export default GetCard;
