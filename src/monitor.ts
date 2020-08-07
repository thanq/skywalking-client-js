/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CustomOptionsType } from './types';
import { JSErrors, PromiseErrors, AjaxErrors, ResourceErrors, VueErrors } from './errors/index';
import Performance from './performance/index';

const ClientMonitor = {
  customOptions: {
    jsErrors: true,
    promiseErrors: true,
    vueErrors: false,
    apiErrors: true, // ajax promise
    resourceErrors: true,
    autoTracePerf: true,
    traceResource: false,
    useFmp: false,
  } as CustomOptionsType,

  register(options: CustomOptionsType) {
    const { serviceName, reportUrl } = options;

    this.customOptions = {
      ...this.customOptions,
      ...options,
    };

    if (this.customOptions.jsErrors) {
      JSErrors.handleErrors({reportUrl, serviceName});
      if (this.customOptions.vue) {
        VueErrors.handleErrors({reportUrl, serviceName}, this.customOptions.vue);
      }
    }
    if (this.customOptions.apiErrors) {
      PromiseErrors.handleErrors({reportUrl, serviceName});
      AjaxErrors.handleError({reportUrl, serviceName});
    }
    if (this.customOptions.resourceErrors) {
      ResourceErrors.handleErrors({reportUrl, serviceName});
    }
    // trace and report perf data and pv to serve when page loaded
    if (document.readyState === 'complete') {
      Performance.recordPerf(this.customOptions);
    } else {
      window.addEventListener('load', () => {
        Performance.recordPerf(this.customOptions);
      }, false);
    }
  },
};

export default ClientMonitor;
