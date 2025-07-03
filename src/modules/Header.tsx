import { useState } from 'react';
import type { FormEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { CHAT_ID, TOKEN } from '../hooks/getEnv';
import type { Product } from '../types/types';

export default function Header() {
    const dispatch = useDispatch();

    const [openInfo, setOpenInfo] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);

    const handleOpenInfo = () => setOpenInfo(true);
    const handleCloseInfo = () => setOpenInfo(false);

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    function handleGetInfo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const tel = formData.get('tel');
        const email = formData.get('email');

        let message = `<b>Get Info</b>\n`;
        message += `<b>Name:</b> ${name}\n`;
        message += `<b>Phone number:</b> ${tel}\n`;
        message += `<b>Email:</b> ${email}`;

        fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "HTML",
            }),
        });

        handleCloseInfo();
    }

    function handleAddProduct(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newProduct: Product = {
            id: Date.now().toString(),
            title: String(formData.get('title')),
            description: String(formData.get('description')),
            price: Number(formData.get('price')),
            images: [String(formData.get('image'))],
        };

        dispatch({ type: "add", payload: newProduct });
        handleCloseAdd();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <div className="w-full flex justify-between items-center">
                        <Button color="inherit" onClick={handleOpenInfo}>More info</Button>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>🛍 My Shop</Typography>
                        <Button color="inherit" onClick={handleOpenAdd}>Add pro</Button>
                    </div>
                </Toolbar>
            </AppBar>

            {/* Info Modal */}
            <Modal open={openInfo} onClose={handleCloseInfo}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        position: 'absolute',
                        top: '30%',
                        left: '37%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 3,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>Enter your info</Typography>
                    <form onSubmit={handleGetInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextField name="name" label="Name" variant="outlined" required />
                        <TextField name="tel" label="Phone Number" variant="outlined" required />
                        <TextField name="email" label="Email" type="email" variant="outlined" required />
                        <Button type="submit" variant="contained">Send</Button>
                    </form>
                </Box>
            </Modal>

            {/* Add Product Modal */}
            <Modal open={openAdd} onClose={handleCloseAdd}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        position: 'absolute',
                        top: '30%',
                        left: '37%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 3,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>Add New Product</Typography>
                    <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextField name="title" label="Product Name" variant="outlined" required />
                        <TextField name="image" label="Image URL" variant="outlined" required />
                        <TextField name="description" label="Description" variant="outlined" required />
                        <TextField name="price" label="Price" type="number" variant="outlined" required />
                        <Button type="submit" variant="contained" color="success">Add</Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}
