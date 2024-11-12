import React from 'react'
import { useEffect } from 'react'
import api from '../../config/axiox'

function History() {
  
    const fetchHistory = async () => {
        try{
            const response = await api.get('/complaints')
        }catch(error){
            console.log(error)
        }   
    }
  
    useEffect(() => {
        fetchHistory();
    }, [])

    return (
    <div>History
    
    </div>
  )
}

export default History