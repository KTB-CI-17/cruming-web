import { useState, useEffect } from 'react';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const mobileDevices = /android|webos|iphone|ipad|ipod|blackberry|windows phone/;
            setIsMobile(mobileDevices.test(userAgent));
        };

        checkIsMobile();
    }, []);

    return isMobile;
};