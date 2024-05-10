import axios from "axios";
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import './FileEditor.css';

const PDFFileViewer = () => {
    const { fileId } = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [file, setFile] = useState([]);
    const [cloudFrontURL, setCloudfrontURL] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await axios.get(`http://ec2-54-242-165-167.compute-1.amazonaws.com:8080/file/${fileId}`);
                setFile(response.data);
                setCloudfrontURL(response.data.fileURL);
            } catch (error) {
                console.error("Error fetching file:", error);
            }
        };
        fetchFile();
    }, [fileId]);

    const handleConvertToDocx = () => {
        setIsConverting(true);
        axios.post(`http://ec2-54-242-165-167.compute-1.amazonaws.com:8080/file/convert/pdf-to-docx/${fileId}`)
            .then(response => {
                console.log(response.data);
                // window.alert(response.data);
                setIsConverting(false);
                window.location.href = response.data;
            })
            .catch(error => {
                console.error(error);
                setIsConverting(false);
            });
    }

    return (
        <div className="home">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <div className="home__content">
                <button className="convert-button" onClick={handleConvertToDocx} disabled={isConverting}>{isConverting ? 'Converting...' : 'Convert to Docx'}</button>


                <iframe src={cloudFrontURL} style={{ width: '100%', height: '500%' }}></iframe>


            </div>
        </div>
    );
};

export default PDFFileViewer;
