import { Box, Button, CircularProgress, Icon, IconButton, Modal, Typography } from '@mui/material';
import React from 'react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const ModalDelete = ({deleting, setDeleting, organization, list, setList}) => {

    const handleClose = () => {
        setDeleting(false);
    }

    const handleDelete = () => {
        let copy = [...list];
        copy = copy.filter((org, i) => {
            return org.company_id != organization.company_id;
        })
        setList(copy);
        setDeleting(false);
    }

    if(!Object.keys(organization).length || !list.length) return <Modal open={deleting}>
            <Box sx={{ 
                width: '60vw', 
                backgroundColor: "white",
                height: '50vh',
                margin: '20vh auto',
                padding: '2em',
                borderRadius: '4px',
                display: "flex", 
                justifyContent: "center",
                alignItems: "center"
                }}>
                <CircularProgress />
            </Box>
        </Modal>

    return (
            <Modal
            open={deleting}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    backgroundColor: "white",
                    maxWidth: '570px',
                    margin: '7vh auto',
                    padding: '2em',
                    borderRadius: '4px'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                        <IconButton onClick={() => handleClose()}>
                            <Icon component={ClearOutlinedIcon}/>
                        </IconButton>
                    </Box>
                    <Box sx={{ textAlign: 'center', my: 3 }}>
                        <Typography sx={{ color: '#486377', fontWeight: 'bold' }} id="modal-modal-title" variant="h6" component="h2">
                        Удаление организации
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Вы уверены, что хотите удалить организацию из списка?
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 5 }}>
                        <Button 
                            onClick={() => handleClose()}
                            variant='outlined' 
                            sx={{ flexGrow: 1 }}>
                            Отменить
                        </Button>
                        <Button 
                            onClick={() => handleDelete()}
                            variant='contained' 
                            sx={{ flexGrow: 2 }}>
                            Удалить
                        </Button>
                    </Box>
                </Box>
            </Modal>
    )
}

export default ModalDelete