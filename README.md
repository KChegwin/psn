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
git clone URL
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
