import React, { useEffect, useState } from "react";
import { Button, Table, Typography, List, Divider, Modal, InputNumber, Popconfirm, Spin, message } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axiox";
import moment from "moment";

function ManageTrip() {
  const [datas, setDatas] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rideDetails, setRideDetails] = useState({});
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Could be organizer or participant
  const [refundAmount, setRefundAmount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await api.get("/rides/getAll");
      setDatas(response.data);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch data");
    }
  };

  const fetchRideDetails = async (rideId) => {
    try {
      setLoading(true);
      const response = await api.get(`/rides/getRideById/${rideId}`);
      setRideDetails((prev) => ({ ...prev, [rideId]: response.data }));
    } catch (error) {
      toast.error(error?.response?.data || "Failed to fetch ride details");
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (expanded, record) => {
    if (expanded) {
      if (!rideDetails[record.rideId]) {
        await fetchRideDetails(record.rideId);
      }
      setExpandedRowKeys([record.rideId]); // Expand only one row at a time
    } else {
      setExpandedRowKeys([]);
    }
  };

  const handleRefund = async () => {
    if (!selectedUser || refundAmount <= 0) {
        message.error("Please enter a valid refund amount.");
        return;
    }

    try {
        setLoading(true);

        const adminId = 3;

        const response = await api.post(`/user/admin-to-user?adminId=${adminId}&userId=${selectedUser.userId}&amount=${refundAmount}`);

        if (response.status === 200) {
            message.success(`Refund of ${refundAmount} processed for ${selectedUser.username}`);
            setRefundModalVisible(false);
            setRefundAmount(0);
            setSelectedUser(null);
            fetchData();
        }
    } catch (error) {
        message.error("Failed to process refund");
    } finally {
        setLoading(false);
    }
};


  const handleDelete = async (id) => {
    try {
      await api.delete(`/rides/delete/${id}`);
      toast.success("Ride deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data || "Failed to delete ride");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "rideId", key: "rideId" },
    { title: "Ride Code", dataIndex: "rideCode", key: "rideCode" },
    { title: "Date", dataIndex: "rideDate", key: "rideDate" },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
render: (startTime) => moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) => moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" onClick={() => toast.info(`Editing ride: ${record.rideId}`)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete"
            description="Do you want to delete this ride?"
            onConfirm={() => handleDelete(record.rideId)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button onClick={() => fetchData()}>Reload Data</Button>
      <Table
        dataSource={datas}
        columns={columns}
        rowKey="rideId"
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender: (record) => {
            const details = rideDetails[record.rideId];
            if (!details) {
              return <Spin />;
            }
            return (
              <div>
                <Typography.Title level={5}>Organizer</Typography.Title>
                <p>
                  {details.organizerUsername || "Not Available"}
                  <Button
                    type="link"
                    onClick={() => {
                      setSelectedUser({
                        userId: details.organizerUserId,
                        username: details.organizerUsername,
                        walletId: details.organizerWalletId,
                      });
                      setRefundModalVisible(true);
                    }}
                  >
                    Refund
                  </Button>
                </p>
                <Divider />
                <Typography.Title level={5}>Participants</Typography.Title>
                {details.participantUsernames.length > 0 ? (
                  <List
                    dataSource={details.participantUsernames}
                    renderItem={(username) => (
                      <List.Item>
                        {username}
                        <Button
                          type="link"
                          onClick={() => {
                            const participant = details.participantUserDetails.find(
                              (p) => p.username === username
                            );
                            setSelectedUser({
userId: participant.userId,
                              username: participant.username,
                              walletId: participant.walletId,
                            });
                            setRefundModalVisible(true);
                          }}
                        >
                          Refund
                        </Button>
                      </List.Item>
                    )}
                  />
                ) : (
                  <p>No participants</p>
                )}
              </div>
            );
          },
        }}
      />
      <Modal
        title={`Refund to ${selectedUser?.username}`}
        open={refundModalVisible}
        onCancel={() => {
          setRefundModalVisible(false);
          setSelectedUser(null);
          setRefundAmount(0);
        }}
        onOk={handleRefund}
        confirmLoading={loading}
      >
        <Typography.Text>Enter the refund amount:</Typography.Text>
        <InputNumber
          style={{ width: "100%", marginTop: "10px" }}
          min={0.01}
          step={0.01}
          value={refundAmount}
          onChange={(value) => setRefundAmount(value)}
        />
      </Modal>
    </div>
  );
}

export default ManageTrip;