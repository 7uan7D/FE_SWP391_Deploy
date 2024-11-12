import React, { useState } from "react";
import {
  PieChartOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Row,
  Col,
  Card,
  Statistic,
  theme,
} from "antd";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

// Sidebar menu items
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  Navigate("/");
};

const items = [
  getItem("Manage Location", "locations", <PieChartOutlined />),
  getItem("Manage Ride", "trip", <PieChartOutlined />),
  getItem("Manage Complaint", "complaint", <PieChartOutlined />),
  getItem("Manage Student", "user", <PieChartOutlined />),
  getItem("Manage Staff", "staff", <PieChartOutlined />),
];

// Profile dropdown menu
const profileMenu = (
  <Menu>
    <Menu.Item key="profile" icon={<UserOutlined />}>
    <Link to="/profile"> Profile </Link>
    </Menu.Item>
    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
      <Link to="/"> Logout </Link>
    </Menu.Item>
  </Menu>
);

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get current route location to dynamically update breadcrumbs and menu selection
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop();

  // Breadcrumbs logic
  const breadcrumbItems = location.pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, arr) => {
      const url = `/${arr.slice(0, index + 1).join("/")}`;
      const displayPath = path.charAt(0).toUpperCase() + path.slice(1);
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{displayPath}</Link>
        </Breadcrumb.Item>
      );
    });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[currentPath]} // Highlight active menu based on route
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ float: "right", paddingRight: 20 }}>
            <Dropdown overlay={profileMenu}>
              <Space>
                <Avatar size="large" icon={<UserOutlined />} />
                <span>Admin</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
{/* Main Content */}
        <Content style={{ margin: "0 16px" }}>
          {/* Breadcrumb Navigation */}
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbItems}
          </Breadcrumb>

          {/* Dashboard Content - Cards for Metrics */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Users" value={112893} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="New Signups" value={132} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Revenue" value={93848} prefix="$" />
                </Card>
              </Col>
            </Row>

            {/* Outlet for dynamic content */}
            <div style={{ marginTop: 32 }}>
              <Outlet />
            </div>
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Booking_Taxi ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;