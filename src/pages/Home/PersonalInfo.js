import React, { Component } from 'react';
import { ChartCard, MiniProgress } from '@/components/Charts';
import { getLSVal } from '@/utils/utils';
import { Row, Col } from 'antd';
import styles from './Home.less';

class PersonalInfo extends Component {
  render() {
    const nutritionix = getLSVal('nutritionix');
    let data = [];
    let calories = 0;
    let breakfastCalories = 0;
    let lunchCalories = 0;
    let dinnerCalories = 0;
    let snackCalories = 0;
    if (_.has(nutritionix, 'data_points')) {
      data = nutritionix.data_points[0].intake_list;
      data.map(item => {
        calories += Number(item.nf_calories);
        return calories;
      });
      data.map(item => {
        switch (item.meals) {
          case 'Breakfast':
            breakfastCalories += Number(item.nf_calories);
            return breakfastCalories;
          case 'Lunch':
            lunchCalories += Number(item.nf_calories);
            return lunchCalories;
          case 'Dinner':
            dinnerCalories += Number(item.nf_calories);
            return dinnerCalories;
          case 'Snack':
            snackCalories += Number(item.nf_calories);
            return snackCalories;
          default:
            return false;
        }
      });
    }

    const str = (calories / 1500) * 100;
    let percentOfGoal = str.toFixed(1);
    percentOfGoal = parseFloat(percentOfGoal) + '%';

    return (
      <div className={styles.personalInfoRectangle}>
        <div className={styles.upperContent}>
          <Row type="flex" justify="space-around" align="middle" style={{ paddingTop: '24px' }}>
            <Col xs={8}>
              <div className={styles.Oval}>
                <div className={styles.Headline6}>57</div>
                <div className={styles.caption}>kg</div>
              </div>
            </Col>
            <Col xs={8}>
              <div className={styles.Surface} />
            </Col>
            <Col xs={8}>
              <div className={styles.Oval}>
                <div className={styles.Headline6}>163</div>
                <div className={styles.caption}>kg</div>
              </div>
            </Col>
          </Row>
          <div className={styles.Headline5}>Jane</div>
        </div>
        <div className={styles.downContent}>
          <Row style={{ marginBottom: '20px' }}>
            <Col xs={12} className={styles.left}>
              <div className={styles.Headline5}>{calories} Cal</div>
              <div className={styles.caption}>consumed</div>
            </Col>
            <Col xs={12} className={styles.right}>
              <div className={styles.Headline5}>1500 Cal</div>
              <div className={styles.caption}>daily goal</div>
            </Col>
          </Row>
          <div>
            <ChartCard
              // loading={loading}
              bordered={false}
              title={null}
              total={percentOfGoal}
              footer={null}
              contentHeight={46}
            >
              <MiniProgress percent={str} strokeWidth={8} target={100} color="#13C2C2" />
            </ChartCard>
          </div>
          <Row>
            <Col sm={6}>
              <div className={styles.Headline6}>{breakfastCalories}</div>
              <div className={styles.caption}>Cal</div>
            </Col>
            <Col sm={6}>
              <div className={styles.Headline6}>{lunchCalories}</div>
              <div className={styles.caption}>Cal</div>
            </Col>
            <Col sm={6}>
              <div className={styles.Headline6}>{dinnerCalories}</div>
              <div className={styles.caption}>Cal</div>
            </Col>
            <Col sm={6}>
              <div className={styles.Headline6}>{snackCalories}</div>
              <div className={styles.caption}>Cal</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default PersonalInfo;
