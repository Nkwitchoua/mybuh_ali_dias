import { CircularProgress, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OrganizationCard from './OrganizationCard';
import axios from 'axios';
import ModalEdit from './ModalEdit';
import ModalDelete from './ModalDelete';

const Main = () => {
    const [ deleting, setDeleting ] = useState(false);
    const [ editing, setEditing ] = useState(false);
    const [ currOrganization, setCurrOrganization ] = useState({});

    const openEditing = (org) => {
        setCurrOrganization(org);
        setEditing(true);
    }

    const openDeleting = (org) => {
        setCurrOrganization(org);
        setDeleting(true);
    }

    const [ list, setList ] = useState([]);

    const [ forms, setForms ] = useState({});

    // const [ systems, setSystems ] =

    const fetchForms = async () => {
        try {
            const res = await axios.get('https://raw.githubusercontent.com/arkdich/mybuh-frontend-test/main/ownerships.json');

            const formsObj = {};

            for(let i = 0; i < res.data.length; i++) {
                formsObj[res.data[i].id] = res.data[i];
            }

            setForms(formsObj);
        } catch(err) {
            console.log(err);
        }
    }

    const fetchList = async () => {
        try {
            const res = await axios.get('https://raw.githubusercontent.com/arkdich/mybuh-frontend-test/main/companies.json');
            setList(res.data)
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(!list.length) return;
        console.log('Список компаний ->', list);
    }, [list]);
    
    useEffect(() => {

        fetchForms();
        const data = fetchList();
    }, [])


    if(!list.length || !Object.values(forms).length) return <CircularProgress />

  return (
    <Container>
        <Typography sx={{ textAlign: 'center', marginBottom: "40px", fontWeight: "600px" }} variant='h5'>
            Мои организации
        </Typography>
        <div className='companies-list'> 
            {
                list.map(item => {
                    return <OrganizationCard 
                        key={item.company_id}
                        organization={item}
                        form={forms[item.form_id]}
                        openEditing={openEditing}
                        openDeleting={openDeleting}
                    />
                })
            }
        </div>

        <ModalEdit 
            editing={editing} 
            setEditing={setEditing} 
            forms={forms}
            organization={currOrganization}
            list={list} 
            setList={setList}/>
        <ModalDelete 
            deleting={deleting} 
            setDeleting={setDeleting}
            organization={currOrganization}
            list={list} 
            setList={setList}/>

    </Container>
  )
}

export default Main