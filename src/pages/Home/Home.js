import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Row, Col, Select, Popover } from 'antd';
import SearchFood from './SearchFood';
import FoodDetails from './FoodDetails';
import PersonalInfo from './PersonalInfo';
import styles from './Home.less';

const { Option } = Select;

@connect(({ nutritionix }) => ({
  nutrientList: nutritionix,
}))
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // clicked: false,
      // clickContent: null,
    };
  }

  componentDidMount = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'nutritionix/fetchNutrients',
    //   payload: []
    // })
  };

  render() {
    const personalDetail = {
      first_name: 'Jane',
      last_name: 'Appleseed',
      height_cm: 163,
      weight_kg: 57,
      daily_goal: 1500,
    };

    return (
      <div className={styles.container}>
        <div className={styles.Rectangle}>
          <SearchFood personalDetail={personalDetail} />
        </div>
        <Row>
          <Col xs={24} sm={8}>
            <PersonalInfo />
          </Col>
          <Col xs={24} sm={16}>
            <FoodDetails />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
