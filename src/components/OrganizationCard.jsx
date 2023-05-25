import { Box, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import apartment from '../assets/Frame 276.png';
import removeIcon from '../assets/remove_icon.svg';
import editIcon from '../assets/edit_icon.svg';

const OrganizationCard = ({ organization, form, openEditing, openDeleting}) => {

    return (
        <div className='organization-card' sx={{ borderRadius: '5px', padding: '10px' }}>
            <Grid container>
                <Grid item xs={8}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <img style={{ maxWidth: '72px', height: 'fit-content', alignSelf: 'center' }} src={organization.logo || apartment}/>
                        <Box sx={{ padding: '10px', display: 'flex', flexDirection: "column", justifyContent: "space-between" }}>
                            <Typography>
                                { form.short } &nbsp;{ organization.company_name }
                            </Typography>

                            <Typography>
                                ИИН/БИН &nbsp;{organization.company_tin}
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid sx={{ display: 'flex', justifyContent: "end", alignItems: "center", gap: '10px' }} item xs={4}>
                    <IconButton onClick={() => openEditing(organization)}>
                        <img src={editIcon} />
                    </IconButton>
                    <IconButton onClick={() => openDeleting(organization)}>
                        <img src={removeIcon} />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    )
}

export default OrganizationCard