import React from 'react';
import _ from 'lodash';
import { getLSVal } from '@/utils/utils';
import { Row, Col, List, Avatar } from 'antd';

const nutritionix = getLSVal('nutritionix');
let data = [];

if (_.has(nutritionix, 'data_points')) {
  data = nutritionix.data_points[0].intake_list;
}
console.warn('length', data.length);
const FoodDetails = () => (
  <div>
    {data.length !== 0 ? (
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={item.photo?<Avatar src={item.photo.thumb} />:null}
              title={
                <Row>
                  <Col sm={12} styls={{ float: 'left' }}>
                    {item.food_name}
                  </Col>
                  <Col sm={12} styls={{ float: 'right' }}>
                    {item.nf_calories}Cal
                  </Col>
                </Row>
              }
              description={
                <Row>
                  <Col sm={12} styls={{ float: 'left' }}>
                    {item.serving_qty}
                  </Col>
                  <Col sm={12} styls={{ float: 'right' }}>
                    {item.meals}
                  </Col>
                </Row>
              }
            />
          </List.Item>
        )}
      />
    ) : (
      ''
    )}
  </div>
);

export default FoodDetails;
