import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Input, Row, Col, Select, Popover } from 'antd';
import { getLSVal } from '@/utils/utils';
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
      dailyCalories: 0,
    };
  }

  componentDidMount = () => {
    const { dailyCalories } = this.state;
    let calories = 0;
    const nutritionix = getLSVal('nutritionix');
    if (_.has(nutritionix, 'data_points')) {
      const data = nutritionix.data_points[0].intake_list;
      data.map(item => {
        calories += Number(item.nf_calories);
        return calories;
      });
    }

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
