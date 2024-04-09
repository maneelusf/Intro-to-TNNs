/**
//  * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as d3 from 'd3';
import * as d3_jp from 'd3-jetpack';
import { Table } from './visualizations/table';
import { GraphDescription } from './visualizations/graph-description';

d3.keys(d3_jp).forEach(key => {
  try {
    d3[key] = d3_jp[key];
  } catch (e) {
  }
});



window.onload = function() {
  new GraphDescription();
  new Table();
};
