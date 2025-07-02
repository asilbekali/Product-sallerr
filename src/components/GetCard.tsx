import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { instance } from '../hooks/instance';
import { Button, Modal } from 'antd';
import { API, CHAT_ID, TOKEN } from '../hooks/getEnv';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
}

const GetCard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        instance.get(API)
            .then((response) => {
                setProducts(response.data.products);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Maʼlumotlarni yuklashda xatolik yuz berdi.');
            });
    }, []);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalVisible(true);
    };

    const sendToTelegram = async () => {
        if (!selectedProduct) return;

        setLoading(true);

        const message = `
🛒 *Yangi Buyurtma* 
📦 Nomi: *${selectedProduct.title}*
💵 Narxi: *$${selectedProduct.price}*
📝 Tavsifi: ${selectedProduct.description}
🔗 Rasmi: ${selectedProduct.images[0]}
        `;

        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            });

            Modal.success({
                title: '✅ Buyurtma muvaffaqiyatli yuborildi!',
                content: `${selectedProduct.title} Telegramga jo‘natildi.`,
            });

            setIsModalVisible(false);
        } catch (err) {
            console.error('Telegramga yuborishda xatolik:', err);
            Modal.error({
                title: '❌ Xatolik',
                content: 'Telegramga yuborishda muammo yuz berdi.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    return (
        <>
            {/* Modalka */}
            <Modal
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Bekor qilish
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={sendToTelegram}
                    >
                        Sotib olish
                    </Button>,
                ]}
                centered
                title={selectedProduct?.title}
                style={{
                    top: 100,
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <img
                    src={selectedProduct?.images[0]}
                    alt={selectedProduct?.title}
                    style={{ width: '100%', borderRadius: '10px', marginBottom: '10px' }}
                />
                <Typography>{selectedProduct?.description}</Typography>
                <Typography strong>💰 Narxi: ${selectedProduct?.price}</Typography>
            </Modal>

            {/* Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-10'>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        sx={{
                            maxWidth: 345,
                            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                            borderRadius: '20px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="180"
                                image={product.images[0]}
                                alt={product.title}
                                sx={{ borderRadius: '20px 20px 0 0' }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    {product.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', height: '50px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {product.description}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50', marginTop: '8px' }}>
                                    ${product.price}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <div className='w-full flex items-center justify-center p-4 bg-gray-50'>
                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                onClick={() => openModal(product)}
                            >
                                Buy now
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default GetCard;
