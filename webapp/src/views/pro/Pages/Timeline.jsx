import React from 'react';

// core components
import GridContainer from '../../../components/Grid/GridContainer';
import GridItem from '../../../components/Grid/GridItem';
import Heading from '../../../components/Heading/Heading';
import Timeline from '../../../components/Timeline/Timeline';
import Card from '../../../components/Card/Card';
import CardBody from '../../../components/Card/CardBody';

import { stories } from '../../../variables/general';

const TimelinePage = () => (
  <div>
    <Heading title="Timeline" textAlign="center" />
    <GridContainer>
      <GridItem xs={12}>
        <Card plain>
          <CardBody plain>
            <Timeline stories={stories} />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  </div>
);

export default TimelinePage;
