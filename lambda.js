/*
 * Copyright 2017 Banco Bilbao Vizcaya Argentaria, S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Run as Lambda fucntion */

const CommentsService = require('./src/service/CommentsService');

var service = new CommentsService();

exports.handler = (event, context, callback) =>  {
  
  context.callbackWaitsForEmptyEventLoop = false;

service
  .getGooglePlayComments()
  .then( (reviews) => {
    reviews = reviews && reviews.reduce((reviewsForApp, list) => {
      return reviewsForApp.reduce((review, list) => {list.push(review); return list;}, list);
    }, []);
    if(reviews && reviews.length > 0){
      
      console.log('Comments found: ' + reviews.length);
      service
        .sendComments(reviews)
        .then( (res) => {
          console.log(res);
          callback(null, res);
        })
        .catch( (err) => {
          console.log(err);
          callback(err);
        });
    } else {
      console.log('There are not comments to send');
      callback(null, 'There are not comments to send');
    }
  })
  .catch( (err) => {
    console.log(err);
    callback(err);
  });

};
