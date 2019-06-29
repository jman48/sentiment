# Description
This project will run sentiment analysis over Google play and App store reviews. It then will save this data so that you can further analyse it. Some examples:

### Sentiment
Get a feel for how your users feel about your applications

### Entity sentiment
Analyse each entity (think keywords) in the reviews and determine the sentiment of it. This is helpful to find insights into what is working well or not well with your product


### Entity affect on reviews
Find the affect each entity has on your reviews. An example for a music mindfulness streaming app is:
![Entity app review analysis example](https://raw.githubusercontent.com/jman48/sentiment/master/example/entity_review_analysis.png?token=ABIUUK3BGZPHNEXCOMCMCHC5EEVWG "Entity app review analysis example")

From this we can see that:
- The app has some issues with buffering and is affecting users as we can see from the sentiment and reviews difference
- Users like the focus music and this show in their sentiment and reviews
 
# Setup
To run the app
1. Clone this repository
1. Run `yarn` to install all dependencies
1. Setup a mysql database and create a file in root of project called `.env`
1. Enter in your DB connection details in the `.env` file (see src/db/index.js as to what you need to enter)
1. Export a variable that points to your Google application credentials `GOOGLE_APPLICATION_CREDENTIALS=<path to your Google application credentials file>`. See https://cloud.google.com/docs/authentication/getting-started on how to create an authentication file for your Google cloud account
1. Run the db migrations using `yarn run migrate:latest`
1. Add a user and source to the `users` and `sources` tables. The `sources` table will take the id of your application (see https://learn.apptentive.com/knowledge-base/finding-your-app-store-id/ for help getting these)
1. Set the source type in the `sources` table to either `PLAY_STORE` or `APP_STORE` based on your source id
1. `yarn run dev` to run the app, gather reviews, run sentiment analysis and save to your db.

# Querying DB
Once you have a bit of data saved you will want to query it. Below are a few SQL queries that will help you analyse the data you have collected

#### Entity sentiment affects on app reviews
```mysql
# Analyse keywords by showing score, magnitude (emotion) and the effect they have on ratings (shown as Difference which is the difference when compared to the apps avg)
select *, `Entity rating avg` - (select AVG(score) from sentiment.reviews) as 'Difference'
from (select entity.name    as 'Keyword', 
             ROUND(AVG(entity.score), 2) as 'Sentiment', #How good/ bad the user feels
             AVG(magnitude) as 'Emotion',                                             #How strongly the user feels
             count(*)       as 'Total', AVG(r.score) as 'Entity rating avg'
      from sentiment.entity
             left join sentiment.reviews r on entity.reviewRowId = r.id
      group by Keyword
      order by Sentiment desc) totals
where (Sentiment > 0.2 or Sentiment < -0.2)
  and Total > 5;
```
