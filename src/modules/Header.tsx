import { useState, FormEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';
import { CHAT_ID, TOKEN } from '../hooks/getEnv';

export default function Header() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    function handleGetInfo(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.currentTarget;
        let message = `<b>Get Info</b>\n`;
        message += `<b>Name:</b> ${target.name.value}\n`;
        message += `<b>Phone number:</b> ${target.tel.value}\n`;
        message += `<b>Email:</b> ${target.email.value}`;

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

        handleClose();
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>

                    <Button color="inherit" onClick={handleOpen}>More info</Button>
                </Toolbar>
            </AppBar>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                closeAfterTransition
                sx={{
                    backdropFilter: "blur(5px)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
            >
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 3,
                        p: 4,
                        outline: 'none'
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2" mb={2}>
                        Enter your info
                    </Typography>
                    <form onSubmit={handleGetInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextField name="name" label="Name" variant="outlined" required />
                        <TextField name="tel" label="Phone Number" type="tel" variant="outlined" required />
                        <TextField name="email" label="Email" type="email" variant="outlined" required />
                        <Button type="submit" variant="contained" color="primary">Send Info</Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}
