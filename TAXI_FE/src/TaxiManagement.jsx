import { Button, Form, Image, Input, Modal, Popconfirm, Table, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import Title from "antd/es/skeleton/Title";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from "./utils/file";

function TaxiManagement() {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const api = "https://66e47912d2405277ed146bcb.mockapi.io/Student";

  const fetchStudent = async () => {
    const response = await axios.get(api);
    console.log(response.data);
    setStudents(response.data);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Image",
        dataIndex: "image",
        key: "image",
        render: (image) => {
          return <Image src={image} alt="" width={100}></Image>;
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Action",
        dataIndex: "id",
        key: "id",
        render: (id) => {
            return <>
                <Popconfirm title="Delete" 
                description="Do you want delete this student"
                onConfirm={() => handleDeleteStudent(id)}
                >
                <Button type="primary" danger>
                    Delete
                </Button>
                </Popconfirm>               
            </>
        }
    },
  ];

  const handleOpenModal = () => {
    setOpenModal(true);
  }
  const handleCloseModal = () => {
    setOpenModal(false);
  }
  const handleSubmitStudent = async (student) => {


    if(fileList.length > 0){
        const file = fileList[0];
        console.log(file);
        const url = await uploadFile(file.originFileObj);
        student.image = url;
    }

    console.log(student);
    try {
        setSubmitting(true);
        const response = await axios.post(api, student);
        toast.success('Successfully')
        setOpenModal(false);
        
        form.resetFields();

        fetchStudent()
    }catch (error) {
        toast.error(error);
    }finally{
        setSubmitting(false);
    }
  }
  const handleDeleteStudent = async (studentId) => {
    try {
        axios.delete(`${api}/${studentId}`);
        toast.success("Delete successfully");
        fetchStudent();
    } catch (ex) {
        toast.error("Fail to delete student");
    }
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
      };
      const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
      const uploadButton = (
        <button
          style={{
            border: 0,
            background: 'none',
          }}
          type="button"
        >
          <PlusOutlined />
          <div
            style={{
              marginTop: 8,
            }}
          >
            Upload
          </div>
        </button>
      );

  return (
    <div>
      <h1>Taxi Management</h1>
        <Button onClick={handleOpenModal}>Create new student</Button>
      <Table columns={columns} dataSource={students} />
      <Modal confirmLoading={submitting} onOk={() => form.submit()} title="Create new student" open={openModal} onCancel={handleCloseModal}>
        <Form onFinish={handleSubmitStudent} form={form}>
            <Form.Item label="Student name" name="name" rules={[
                {
                    required:true,
                    message:"Please input student's name",
                }

            ]}
            >

                <Input />
            </Form.Item>

            <Form.Item label="Student code" name="code" rules={[
                {
                    required:true,
                    message:"Please input student's code",
                },
                {
                    pattern: "SE\\d{6}$",
                    message:"Invalid format",
                },
            ]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="Student " name="code" rules={[
                {
                    required:true,
                    message:"Please input student's code",
                },
                {
                    pattern: "SE\\d{6}$",
                    message:"Invalid format",
                },
            ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="image" name="image">
            <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
            </Form.Item>

        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default TaxiManagement;
