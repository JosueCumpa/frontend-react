import React from "react";
import { Image } from 'antd';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center">


            <h1 className="font-bold text-3xl text-red-600">404 - Página no encontrada</h1>
            <p className="text-large py-10 uppercase font-bold text-red-600">
                Lo sentimos, la página que estás buscando no existe.
            </p>
            <Image
                width={200}
                src="https://static.vecteezy.com/system/resources/previews/007/162/540/non_2x/error-404-page-not-found-concept-illustration-web-page-error-creative-design-modern-graphic-element-for-landing-page-infographic-icon-free-vector.jpg"
            />
        </div>
    );
};

export default NotFound;
