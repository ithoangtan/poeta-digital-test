import { Modal, Button, Form, Input, Typography, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import qs from 'query-string';

export const ACTIONS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DEL: 'DEL'
};
const layout = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
};

const ActionModal = (props) => {
  let title = 'Delete';
  let btnText = 'Delete';
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [countMeal, setCountMeal] = useState(0);
  const [validateStatus, setValidateStatus] = useState();
  const [debouncedValue, setDebouncedValue] = useState('');
  const [,] = useDebounce(
    () => {
      setDebouncedValue(form.getFieldValue('strMeal'));
    },
    400,
    [form.getFieldValue('strMeal')]
  );

  useEffect(() => {
    if (debouncedValue) {
      const params = {
        s: debouncedValue
      };
      const existMeal = props.meals?.find((m) => debouncedValue === m.strMeal);
      if (existMeal) {
        setCountMeal(existMeal.count || 0);
        setValidateStatus();
        return;
      }
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${qs.stringify(params)}`)
        .then((res) => res.json())
        .then(
          (result) => {
            setCountMeal(result?.meals?.length || 0);
            setValidateStatus();
          },
          (error) => {
            message.error('Load data errors!');
          }
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    setCountMeal(props.dataAction?.count || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataAction?.count]);

  switch (props.action) {
    case ACTIONS.ADD:
      title = 'Add new';
      btnText = 'Add';
      break;
    case ACTIONS.EDIT:
      title = 'Edit meal';
      btnText = 'Update';
      form.setFieldsValue('strMeal', props.dataAction?.strMeal);
      break;
    default:
      break;
  }

  const handleOK = useCallback(() => {
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFieldsChange = useCallback((changedFields, allFields) => {
    const [strMeal] = changedFields;
    if (strMeal?.value?.length) {
      setValidateStatus('validating');
    }
  }, []);

  const renderContentForm = () => {
    switch (props.action) {
      case ACTIONS.ADD:
      case ACTIONS.EDIT:
        return (
          <>
            {props.action === ACTIONS.ADD && <Typography.Paragraph>Input the meal name will count.</Typography.Paragraph>}
            <Form.Item
              validateStatus={validateStatus}
              label=""
              name="strMeal"
              rules={[{ required: true, message: 'Please input meal name!' }]}
              hasFeedback>
              <Input ref={inputRef} placeholder="Meal name" />
            </Form.Item>
            <Typography.Paragraph>{`The count is ${countMeal}.`}</Typography.Paragraph>
          </>
        );
      default:
        return (
          <Typography.Paragraph>
            Are your want to delete <Typography.Text strong>{props.dataAction?.strMeal}</Typography.Text> with the count is
            <Typography.Text strong> {props.dataAction?.count}</Typography.Text>.
          </Typography.Paragraph>
        );
    }
  };

  const onFinish = (values) => {
    let indexOfMeal = props.meals?.findIndex((m) => m.strMeal === values.strMeal);
    if (props.action === ACTIONS.EDIT) indexOfMeal = props.meals?.findIndex((m) => m.strMeal === props.dataAction?.strMeal);
    switch (props.action) {
      case ACTIONS.ADD:
        if (indexOfMeal === -1) props.setMeals([...props.meals, { strMeal: values.strMeal, count: countMeal }]);
        else {
          const newMeals = Array.from(props.meals);
          newMeals[indexOfMeal] = { ...newMeals[indexOfMeal], strMeal: values.strMeal, count: countMeal };
          props.setMeals(newMeals);
        }
        break;
      case ACTIONS.EDIT:
        const newMeals = Array.from(props.meals);
        newMeals[indexOfMeal] = { ...newMeals[indexOfMeal], strMeal: values.strMeal, count: countMeal };
        props.setMeals(newMeals);
        break;
      default:
        props.setMeals([...props.meals?.filter((f) => f.strMeal !== props.dataAction?.strMeal)]);
        break;
    }
    props.setAction();
    props.setDataAction();
    form.resetFields();
  };

  useEffect(() => {
    if (props.action && inputRef && props.action !== ACTIONS.DEL) {
      setValidateStatus('validating');
      form.setFieldsValue(props.dataAction);
      setTimeout(() => {
        setValidateStatus();
        inputRef.current.focus();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.action]);

  return (
    <Modal
      //
      width={350}
      title={title}
      visible={props.visible}
      footer={[
        <Button type="primary" danger={props.action === ACTIONS.DEL} onClick={handleOK}>
          {btnText}
        </Button>
      ]}
      onCancel={() => {
        form.resetFields();
        props.setAction();
        props.setDataAction();
      }}
      {...props}>
      <Form {...layout} form={form} name="action-control-hooks" onFinish={onFinish} onFieldsChange={onFieldsChange}>
        {renderContentForm()}
      </Form>
    </Modal>
  );
};
export default ActionModal;
