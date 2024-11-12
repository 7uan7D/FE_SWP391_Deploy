import { Button, Result } from 'antd';
import React from 'react'

function ProtectedRoute({role, children}) {

    const user = JSON.parse(localStorage.getItem('user'));

    if(user && user.role === role){
        return children;
    }

    return(
    <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Button type="primary">Back Home</Button>}
     />
    );
}

export default ProtectedRoute