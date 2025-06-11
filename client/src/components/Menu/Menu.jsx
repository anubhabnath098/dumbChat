import React, { useState } from 'react'
import styled from 'styled-components'
import SearchIcon from '@mui/icons-material/Search';
import Logout from '../Logout/Logout';
import { TextField } from '@mui/material';


function Menu({searchTerm, setSearchTerm}) {
  return (
    <Container>
        <div className="menus">
            <input type="text" placeholder='search for users...' className='search' value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
        </div>
    </Container>
  )
}


const Container = styled.div`

            display:block;
            .menus{
            display:flex;
            width:100%;
            height:100%;
            align-items:center;
            justify-content:center;
            background-color:#080420;
            border-radius:2rem;
            
        }
        .search{
            background-color:transparent;
            color:white;
            padding:0.7rem;
            border:solid 1px;
            border-radius:2rem;
            text-align:center;
            }
        
    
    
`
export default Menu
