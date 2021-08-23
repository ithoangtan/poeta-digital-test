import { Table, Space, Typography, Divider, Button, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import './meals.css';
import styled from 'styled-components';
import qs from 'query-string';
import ActionModal, { ACTIONS } from './ActionModal';

const TableStyled = styled(Table)`
  .ant-table-title {
    padding-left: 0px;
    padding-right: 0px;
  }
`;

const Products = (props) => {
  const columns = [
    {
      title: 'No.',
      dataIndex: 'no.',
      key: 'name',
      width: 60,
      render: (text, row, index) => <Typography.Link>{index + 1}</Typography.Link>
    },
    {
      title: 'Meal',
      dataIndex: 'strMeal',
      key: 'strMeal',
      render: (text) => <Typography.Text>{text}</Typography.Text>
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      render: (text) => <Typography.Text>{text || 1}</Typography.Text>
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 140,
      render: (text, record) => (
        <Space size={8} align="start">
          <Typography.Link
            onClick={() => {
              setAction(ACTIONS.EDIT);
              setDataAction(record);
            }}>
            Edit
          </Typography.Link>
          <Divider type="vertical" />
          <Typography.Link
            onClick={() => {
              setAction(ACTIONS.DEL);
              setDataAction(record);
            }}>
            Delete
          </Typography.Link>
        </Space>
      )
    }
  ];

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [needLoadAgain, setNeedLoadAgain] = useState(false);
  // const [params, setParams] = useState({ s: 'Arrabiata' });
  const [dataAction, setDataAction] = useState();
  const [action, setAction] = useState();

  useEffect(() => {
    setLoading(true);
    const params = {
      s: 'Arrabiata'
    };
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${qs.stringify(params)}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setMeals(
            (result?.meals || []).map((m) => {
              return { ...m, count: 1 };
            })
          );
          setLoading(false);
          setNeedLoadAgain(false);
        },
        (error) => {
          message.error('Load data errors!');
          setLoading(false);
          setNeedLoadAgain(false);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needLoadAgain]);

  const handleAdd = useCallback((e) => {
    setAction(ACTIONS.ADD);
  }, []);

  return (
    <>
      <TableStyled
        //
        title={() => {
          return (
            <div className="table__title">
              <Typography.Title level={5}>Product List</Typography.Title>
              <Button type="primary" onClick={handleAdd}>
                Add new
              </Button>
            </div>
          );
        }}
        loading={loading}
        columns={columns}
        dataSource={meals}
      />
      <ActionModal
        visible={Boolean(action)}
        action={action}
        dataAction={dataAction}
        setAction={setAction}
        setDataAction={setDataAction}
        meals={meals}
        setMeals={setMeals}></ActionModal>
    </>
  );
};

export default Products;
