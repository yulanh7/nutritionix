import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Select, Dropdown, Modal, Divider, Form, Button, Row, Col } from 'antd';
import { getLSVal } from '@/utils/utils';
import _ from 'lodash';
import moment from 'moment';
import styles from './Home.less';

const { Option } = Select;
const { Search } = Input;

@Form.create()
@connect(({ nutritionix }) => ({
  nutrientList: nutritionix,
}))
class searchFood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
      modalData: {},
      modalVisible: false,
      isCommon: true,
    };
  }

  onSearch = (value, event) => {
    const { dispatch } = this.props;

    if (value !== '') {
      dispatch({
        type: 'nutritionix/searchFood',
        payload: value,
      });

      this.setState({
        dropdownVisible: true,
      });
    }
  };

  handleClickChange = visible => {
    this.setState({
      dropdownVisible: visible,
    });
  };

  handleInputOnChange = () => {
    this.setState({
      dropdownVisible: false,
    });
  };

  showModal = item => {
    // localStorage.setItem('favoritePairs', 'aaa');
    const { dispatch } = this.props;

    if (_.has(item, 'nix_brand_id')) {
      this.setState({
        isCommon: false,
        modalData: item,
      });
    } else {
      dispatch({
        type: 'nutritionix/fetchNutrients',
        payload: item.food_name,
      });
      this.setState({
        isCommon: true,
      });
    }

    this.setState({
      modalVisible: true,
      dropdownVisible: false,
    });
  };

  handleCancel = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({
      modalVisible: false,
    });
    setFieldsValue({
      meals: null,
      serving_qty: 1,
    });
  };

  handleSubmit = (e, modalData) => {
    e.preventDefault();
    const {
      form: { validateFieldsAndScroll, setFieldsValue },
      personalDetail,
    } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        let intake_items = {
          ...modalData,
          ...values,
        };
        intake_items = _.pick(intake_items, [
          'food_name',
          'serving_qty',
          'meals',
          'nf_calories',
          'serving_unit',
          'photo',
        ]);
        const nutritionix = getLSVal('nutritionix');

        if (_.has(nutritionix, 'data_points')) {
          let intake_list = nutritionix.data_points[0].intake_list;
          intake_list.push(intake_items);
          const diet = {
            ...personalDetail,
            data_points: [
              {
                date: moment().format('DDMMYYYY'),
                intake_list,
              },
            ],
          };
          localStorage.setItem('nutritionix', JSON.stringify(diet));
        } else {
          let intake_list = [];
          intake_list.push(intake_items);
          const diet = {
            ...personalDetail,
            data_points: [
              {
                date: moment().format('DDMMYYYY'),
                intake_list,
              },
            ],
          };
          localStorage.setItem('nutritionix', JSON.stringify(diet));
        }

        setFieldsValue({
          meals: null,
          serving_qty: 1,
        });
        this.setState({
          modalVisible: false,
        });
      } else {
        console.log(err);
      }
    });
  };

  handleChangeServingQty = (e, foodCategory) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const qty = e.target.value;
    const nf_calories = foodCategory.nf_calories * qty;
    if (foodCategory.brand_name !== null) {
      setFieldsValue({
        nf_calories,
      });
    } else {
      const nf_calories = foodCategory.nf_calories * qty;
      const serving_weight_grams = foodCategory.serving_weight_grams * qty;
      setFieldsValue({
        serving_weight_grams,
        nf_calories,
      });
    }
  };

  render() {
    const { modalData = {}, dropdownVisible, modalVisible, isCommon } = this.state;
    const {
      form: { getFieldDecorator },
      nutrientList: {
        food = [],
        nutrientList: { foods = [] },
      },
      nutrientList,
    } = this.props;
    let commonFood = [];
    let brandedFood = [];
    if (food.length !== 0) {
      commonFood = food.common;
      brandedFood = food.branded;
    }

    const brandedFoodContent = brandedFood.map(item => (
      <div>
        <a onClick={() => this.showModal(item)}>
          <span role="img" aria-label={item.food_name}>
            <img src={item.photo.thumb} className={styles.Surface} alt={item.food_name} />
            🇨{' '}
          </span>
          {item.food_name}
        </a>
      </div>
    ));
    const commonFoodContent = commonFood.map(item => (
      <div>
        <a onClick={() => this.showModal(item)}>
          <span role="img" aria-label={item.food_name}>
            <img src={item.photo.thumb} className={styles.Surface} alt={item.food_name} />
            🇨{' '}
          </span>
          {item.food_name}
        </a>
      </div>
    ));

    const clickContent = (
      <div>
        <Divider orientation="left">Common</Divider>
        {commonFoodContent}
        <Divider orientation="left">Branded</Divider>
        {brandedFoodContent}
      </div>
    );

    return (
      <div>
        {isCommon ? (
          <Modal
            title="Common Food Modal"
            visible={modalVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <div className={styles.modelSurface}>
              {foods.length !== 0 ? (
                <div>
                  <div>
                    {foods[0].photo ? (
                      <img
                        src={foods[0].photo.thumb}
                        alt={foods[0].food_name}
                        className={styles.Surface}
                      />
                    ) : null}
                  </div>
                  <div className={styles.Headline5} style={{ marginBottom: '20px' }}>
                    {foods[0].food_name}
                  </div>
                  <div>
                    <Form onSubmit={e => this.handleSubmit(e, foods[0])}>
                      <Row
                        style={{
                          padding: '60px 0',
                          borderBottom: '1px solid lightgrey',
                          borderTop: '1px solid lightgrey',
                        }}
                      >
                        <Col xs={{ span: 7, offset: 1 }} className={styles.Rectangle3}>
                          <div className={styles.caption} style={{ padding: '11px 0 0 11px' }}>
                            Service
                          </div>
                          <Form.Item style={{ marginBottom: '-5px' }}>
                            {getFieldDecorator('serving_qty', {
                              rules: [{ required: true }],
                              initialValue: foods[0].serving_qty,
                            })(<Input onChange={e => this.handleChangeServingQty(e, foods[0])} />)}
                          </Form.Item>
                          <div className={styles.caption}>{foods[0].serving_unit}</div>
                        </Col>
                        <Col xs={{ span: 4, offset: 1 }}>
                          <Form.Item style={{ marginBottom: '-5px' }}>
                            {getFieldDecorator('serving_weight_grams', {
                              initialValue: `${foods[0].serving_weight_grams}`,
                            })(<Input disabled style={{ outline: 'none' }} />)}
                          </Form.Item>
                          <div className={styles.greyCaption}>grams</div>
                        </Col>
                        <Col xs={{ span: 11 }}>
                          <Form.Item style={{ marginBottom: '-5px' }}>
                            {getFieldDecorator('nf_calories', {
                              initialValue: `${foods[0].nf_calories}`,
                            })(<Input disabled />)}
                          </Form.Item>
                          <div className={styles.greyCaption}>Calories</div>
                        </Col>
                      </Row>
                      <div className={styles.Overline}>Add to Today</div>
                      <Form.Item style={{ marginTop: '20px' }}>
                        {getFieldDecorator('meals', {
                          rules: [{ required: true }],
                        })(
                          <Select>
                            <Option value="snack">Snack</Option>
                            <Option value="Breakfast">Breakfast</Option>
                            <Option value="lunch">Lunch</Option>
                            <Option value="dinner">Dinner</Option>
                          </Select>
                        )}
                      </Form.Item>
                      <Form.Item>
                        <Row style={{ textAlign: 'center' }}>
                          <Button type="primary" htmlType="submit">
                            Add
                          </Button>
                          <Button style={{ marginLeft: 24 }} onClick={this.handleCancel}>
                            Cancel
                          </Button>
                        </Row>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>
        ) : (
          <Modal
            title="Branded Food Modal"
            visible={modalVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <div className={styles.modelSurface}>
              <div>
                {modalData.photo ? (
                  <img
                    src={modalData.photo.thumb}
                    alt={modalData.food_name}
                    className={styles.Surface}
                  />
                ) : null}
              </div>
              <div className={styles.Headline5}>
                {' '}
                {modalData.brand_name} {modalData.food_name}
              </div>
              <div>
                <Form onSubmit={e => this.handleSubmit(e, modalData)}>
                  <Row>
                    <Col sm={12}>
                      <Form.Item label="Service">
                        {getFieldDecorator('serving_qty', {
                          rules: [{ required: true }],
                          initialValue: modalData.serving_qty,
                        })(
                          <Input
                            type="number"
                            onChange={e => this.handleChangeServingQty(e, modalData)}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col sm={12}>
                      <Form.Item>
                        {getFieldDecorator('nf_calories', {
                          initialValue: modalData.nf_calories,
                        })(<Input disabled />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>{modalData.serving_unit}</Col>
                    <Col xs={12}>Calories</Col>
                  </Row>
                  <Form.Item>
                    {getFieldDecorator('meals', {
                      rules: [{ required: true }],
                    })(
                      <Select>
                        <Option value="snack">Snack</Option>
                        <Option value="Breakfast">Breakfast</Option>
                        <Option value="lunch">Lunch</Option>
                        <Option value="dinner">Dinner</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Row style={{ textAlign: 'center' }}>
                      <Button type="primary" htmlType="submit">
                        Add
                      </Button>
                      <Button style={{ marginLeft: 24 }} onClick={this.handleCancel}>
                        Cancel
                      </Button>
                    </Row>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Modal>
        )}
        <div className={styles.Rectangle}>
          <Dropdown
            overlay={clickContent}
            visible={dropdownVisible}
            overlayClassName={styles.dropDownListSurface}
          >
            <div className={styles.Rectangle13}>
              <Search
                placeholder="Search food"
                onSearch={value => this.onSearch(value)}
                onChange={this.handleInputOnChange}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default searchFood;
