import React from 'react'
import { Button } from 'antd'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
const ToggleThemeButton = ({ darkTheme, ToggleTheme }) => {
    return (
        <div className='toggle-theme-btn'>
            <Button onClick={ToggleTheme}>
                {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
            </Button>
        </div>
    )
}

export default ToggleThemeButton
