import { Box, Button, CircularProgress, FormControl, FormControlLabel, FormHelperText, Grid, Icon, IconButton, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import axios from 'axios';

const ModalEdit = ({editing, setEditing, forms, organization, list, setList}) => {

    const [ editedData, setEditedData ] = useState({...organization});
    const [ formsToSystems, setFormsToSystems ] = useState({});
    const [ taxSystems, setTaxSystems ] = useState([]);
    const [ activeForm, setActiveForm ] = useState('');

    const handleClose = () => {
        setEditing(false);
    }

    const fetchTaxSystems = async () => {
        try {
            const res = await axios.get('https://raw.githubusercontent.com/arkdich/mybuh-frontend-test/main/tax-systems.json');
            setTaxSystems(res.data)
        } catch(err) {
            console.log(err);
        }
    }

    const fetchFormsToSystems = async () => {
        const hash = {};
        try {
            const res = await axios.get('https://raw.githubusercontent.com/arkdich/mybuh-frontend-test/main/form-to-system.json');
            const data = res.data;

            for(let i = 0; i < data.length; i++) {
                const curr = data[i];
                if(!hash[curr.form_ownership_id]) {
                    hash[curr.form_ownership_id] = [curr.tax_system_id];
                } else {
                    hash[curr.form_ownership_id] = [...hash[curr.form_ownership_id], curr.tax_system_id];
                }
            }

            setFormsToSystems(hash);

        } catch(err) {
            console.log(err);
        }
    }

    const handleFormTypeChange = (e) => {
        const val = e.target.value;
        setEditedData({
            ...editedData,
            form_id: val
        });
        if(formsToSystems[val]) {
            setEditedData({
                ...editedData,
                tax_id: formsToSystems[val][0]
            })
        }
        setActiveForm(val);
    }

    const handleOtherTypeChange = (e) => {
        const val = e.target.value;
        setEditedData({
            ...editedData,
            form_id: val
        });
        if(formsToSystems[val]) {
            setEditedData({
                ...editedData,
                tax_id: formsToSystems[val][0]
            })
        }
        setActiveForm(val);
    }

    const handleOrgTypeChange = (e) => {
        let allTypes = orgTypes.slice();
        const index = Number(e.target.getAttribute('index'));
        
        allTypes = allTypes.map((type, ind) => {
            type.active = ind === index;
            
            return type;
        });

        setOrgTypes([
            ...allTypes
        ]);

        setActiveForm(orgTypes[index].form_id)

        setEditedData({
            ...editedData,
            form_id: orgTypes[index].form_id
        });
    }

    const handleNumberChange = (e) => {
        const val = e.target.value;
        
        setEditedData({
            ...editedData,
            company_tin: val
        });
    }
    
    const handleNameChange = (e) => {
        const val = e.target.value;

        setEditedData({
            ...editedData,
            company_name: val
        });
    }
    
    const [ orgTypes, setOrgTypes ] = useState([
        {
            name: 'ТОО',
            short: 'ТОО',
            active: false,
            form_id: 1
        },
        {
            name: 'ИП',
            short: 'ИП',
            active: false,
            form_id: 14
        },
        {
            name: 'Прочие',
            short: 'ЮЛ',
            active: false,
            form_id: 2
        },
    ]);

    const saveEditedData = () => {
        let orig = [...list];

        orig = orig.map(item => {
            if(item.company_id === editedData.company_id) {
                return editedData;
            } else {
                return item;
            }
        });
        
        setList(orig);
        setEditing(false);
    }

    useEffect(() => {
        fetchFormsToSystems();
        fetchTaxSystems();
    }, []);
    
    useEffect(() => {
        if(!organization || !organization.form_id) return;
        setEditedData(organization);
        setActiveForm(organization.form_id);

        let ind = 0;
        let orgTypesCopy = [...orgTypes];

        orgTypesCopy.forEach((orgType, i) => {
            if(organization.form_id === orgType.form_id) ind = i;
        });

        orgTypesCopy = orgTypesCopy.map((org, i) => i == ind ? {...org, active: true} : {...org, active: false});

        setOrgTypes(orgTypesCopy);
    }, [organization])

    if(!taxSystems.length || !Object.keys(editedData).length || !Object.keys(formsToSystems).length) return <Modal open={editing}>
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
            open={editing}
            onClose={handleClose}
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
                    <Box sx={{ display: 'flex', justifyContent: "end" }}>
                        <IconButton onClick={() => handleClose()}>
                            <Icon component={ClearOutlinedIcon}/>
                        </IconButton>
                    </Box>
                    <Box marginBottom="24px">
                        <Typography 
                            textAlign='center'
                            id="modal-edit-title" 
                            variant="h6" 
                            component="h2">
                            Редактировать данные организации
                        </Typography>
                    </Box>

                    <Box id='modal-edit-body'>
                        <Grid container spacing={2}>
                            {
                                orgTypes.map((type, index) => {
                                    return <Grid item xs={4}>
                                                <Button 
                                                    onClick={
                                                        type.active ? () => {}
                                                        : (e) => handleOrgTypeChange(e)
                                                    }
                                                    index={index}
                                                    sx={{ width: '100%' }} 
                                                    variant='contained' 
                                                    color={type.active ? 'primary' : 'grey'}>
                                                    {type.name}
                                                </Button>
                                            </Grid>
                                })
                            }
                        </Grid>

                        <Box display={ orgTypes[2].active ? 'block' : 'none' }>
                            <RadioGroup 
                                onChange={(e) => handleOtherTypeChange(e)}
                                defaultValue='2'>
                                <FormControlLabel 
                                    value={2}
                                    control={<Radio />} 
                                    label="Юридические лица" />
                                <FormControlLabel 
                                    value={15}
                                    control={<Radio />} 
                                    label="Частная практика" />
                                <FormControlLabel 
                                    value={20}
                                    control={<Radio />} 
                                    label="Физические лица" />
                            </RadioGroup>
                        </Box>

                        <Box display={
                            (String(editedData.form_id) != 1 &&
                            String(editedData.form_id) != 14 &&
                            String(editedData.form_id) != 20) ?
                            "block" :
                            "none"
                        }>
                            <FormControl fullWidth>
                                <FormHelperText>Выберите форму собственности</FormHelperText>
                                <Select
                                    MenuProps = {{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200
                                            }
                                        }
                                    }}
                                    onChange={(e) => handleFormTypeChange(e)}
                                    value={editedData.form_id}
                                    >
                                    {
                                        Object.values(forms).map(form => {
                                            // if(form.id === activeForm) return [];
                                            return <MenuItem 
                                                    style={ form.id === activeForm ? {display: 'none'} : {display: 'block'}}
                                                    key={form.id}
                                                    value={form.id}
                                                >
                                                {form.full}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>

                        <Box display={ (activeForm != 20 && activeForm != 15) && formsToSystems[activeForm] ? 'block' : 'none' }>
                            <FormControl fullWidth>
                                <FormHelperText>Выберите систему налогообложения</FormHelperText>
                                <Select
                                    MenuProps = {{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200
                                            }
                                        }
                                    }}>
                                    {
                                        taxSystems.map(system => {
                                            if(formsToSystems[activeForm] && formsToSystems[activeForm].indexOf(system.id) != -1) {
                                                return <MenuItem
                                                    value={system.id}>
                                                    { system.full }
                                                </MenuItem>
                                            }
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <FormControl fullWidth>
                                <FormHelperText>Введите ИИН/БИН</FormHelperText>
                                <TextField
                                    onChange={(e) => handleNumberChange(e)}
                                    value={editedData.company_tin}>
                                </TextField>
                            </FormControl>
                        </Box>

                        <Box>
                            <FormControl 
                                fullWidth
                                className='form-control--no-border-radius'
                                sx={{ 
                                    borderTopLeftRadius: "0", 
                                    borderBottomLeftRadius: "1px"
                                }}>
                                <FormHelperText>Введите название компании</FormHelperText>
                                <Box sx={{ display: 'flex' }} >
                                    <div style={{ 
                                            border: '1px solid #dfdfdf',
                                            borderTopLeftRadius: "4px", 
                                            borderBottomLeftRadius: "4px",
                                            padding: '12xp',
                                            display: "flex",
                                            alignItems: "center",
                                         }}>
                                        <Typography sx={{ mx: 2 }}>
                                        {
                                            orgTypes.map(type => {
                                                if(type.active == true) return type.short
                                            })
                                        }
                                        </Typography>
                                    </div>
                                    <TextField 
                                        onChange={(e) => handleNameChange(e)}
                                        value={editedData.company_name}
                                        sx={{ 
                                            width: '100%', 
                                            borderLeft: 'none', 
                                            borderTopLeftRadius: "0", 
                                            borderBottomLeftRadius: "0" 
                                        }}
                                        >
                                    </TextField>
                                </Box>

                            </FormControl>
                        </Box>

                    </Box>

                    <Box my={2} id='modal-edit_footer' sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button 
                            onClick={() => saveEditedData()}
                            color='success' 
                            variant='contained'>
                            Сохранить
                        </Button>
                    </Box>
                </Box>
            </Modal>
    )
}

export default ModalEdit