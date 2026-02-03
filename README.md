This is a simple react dashboard displaying video data metrics attached in CSV files 

The dashboard allows the user to view the total number of views on posts on a given date, and explore the breakdown of those views by video type (short vs long form) and by channel. The two views can be switched between using the buttons at the top, and the date range can be altered using the two date input bounds.

The ‘StackedViewsChart’ component uses an async to fetch the data from the CSVs. The papa parse library then parses the data into a JSON allowing it to be processed. The data  from the ‘stats’ and ‘posts’ CSVs is joined and combined on the video_id shared column. Based on the configuration of inputs, (Date and Series) the data is aggregated, grouped by type, arranged by date and fed to a HighCharts Object. The useEffect ensures that the object re renders on changes to the set config.

To run the project using node and vite, run the following in your terminal

Check you have node installed
```
node -v
```
clone the project
```
git clone https://github.com/KChegwin/psn
```
navigate to the project folder
```
cd PROJECT-FOLDER
```

Install the dependencies
```
npm install
```
Run
```
npm run dev
```
To start the local development server

# SQL questions


1.
SELECT
    p.video_id,
    p.title,
    p.video_type,
    SUM(s.views) AS total_views
FROM stats s
JOIN posts p 
    ON p.video_id = s.video_id
GROUP BY 
    p.video_id,
    p.title,
    p.video_type
ORDER BY total_views DESC;

2.
SELECT
    s.data_date,
    p.video_type,
    SUM(s.views) AS views
FROM poststats s
JOIN posts p 
    ON p.video_id = s.video_id
GROUP BY 
    s.data_date,
    p.video_type
ORDER BY 
    s.data_date,
    p.video_type;

3.
SELECT
    p.video_id,
    p.title,
    p.video_type,
    SUM(s.views) AS views_last_28_days
FROM stats s
JOIN posts p 
    ON p.video_id = s.video_id
WHERE s.data_date >= DATE('now', '-28 days')
GROUP BY 
    p.video_id,
    p.title,
    p.video_type
ORDER BY views_last_28_days DESC
LIMIT 5;

# Use of AI
Given the time constraints of the project, I found the use of AI beneficial. I was able to use chat GPT to provide the code that populates the grouped Record and explain why my earlier approach didn't give the desired object structure. in this kind of self contained component, I find the use of LLMs useful, as their outputs are easily tested and explainable. given more time, I would have queried the CSVs for most popular channels to set as the default for the 'Channel view' rather than hard coding three arbitrarily. similarly, I would have set the default date range to be the last month for greater clarity. I would have liked to explore adding a drop down selection for the channel series so that each channel could be added individually rather than greyed out in the legend at the bottom. Finally, given more time I would like to clean up the UI, making the buttons, date inputs and charts stylistically consistent making the whole thing a bit more pleasant to use.
