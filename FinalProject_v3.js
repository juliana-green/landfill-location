let county_demo;
let county_landfill;
let zip_landfill;
let zip_demo;

function preload() {
  county_demo = loadTable('county_demographic_data.csv', 'csv', 'header');
  county_landfill = loadTable('landfilll_aggregated_data_v4.csv', 'csv', 'header');
  zip_landfill = loadTable('landfilll_aggregated_data_v5.csv', 'csv', 'header');
  zip_demo = loadTable('zip_demographic_data.csv', 'csv', 'header');
  landfill_img = loadImage('landfill_img.jpg');
}

function setup() {
  createCanvas(1000, 700);
}

let posY = 0;
let draw_WA = false;
let clicked = false;
let loops_since_click = 0;
let select_fills = 0;
let prev_select_fills = 0;
let select_demo = 0;
let prev_select_demo = 0;


//--------------------------------------------DRAW FUNCTION---------------------------------------------------

function draw() {
  background(255);
  if (posY > 0) {
    posY = 0;
  }
  if (posY < -4020) {
    posY = -4020;
  }
  
  //--------------------------------------------AVERAGE DEMOGRAPHICS---------------------------------------------------  
  //Mean demographics by zip data
  let ave_WA_zip = (zip_demo.get(2, 35));
  let ave_BA_zip = (zip_demo.get(2, 36));
  let ave_IA_zip = (zip_demo.get(2, 37));
  let ave_AA_zip = (zip_demo.get(2, 38));
  let ave_NA_zip = (zip_demo.get(2, 39));
  let ave_HA_zip = (zip_demo.get(2, 44));
  let ave_TOM_zip = (zip_demo.get(2, 41));
  let ave_zips = [ave_WA_zip, ave_BA_zip, ave_HA_zip, ave_IA_zip, ave_AA_zip, ave_TOM_zip];
  
  //Median demographics by zip data
  let med_WA_zip = int(zip_demo.get(4, 35));
  let med_BA_zip = int(zip_demo.get(4, 36));
  let med_IA_zip = int(zip_demo.get(4, 37));
  let med_AA_zip = int(zip_demo.get(4, 38));
  let med_NA_zip = int(zip_demo.get(4, 39));
  let med_HA_zip = int(zip_demo.get(4, 44));
  let med_TOM_zip = int(zip_demo.get(4, 41));
  
  //Percentile at which demographic reaches national average
  let percentile_avg_WA = zip_demo.get(16, 35);
  let percentile_avg_BA = zip_demo.get(16, 36);
  let percentile_avg_IA = zip_demo.get(16, 37);
  let percentile_avg_AA = zip_demo.get(16, 38);
  let percentile_avg_TOM = zip_demo.get(16, 41);
  let percentile_avg_HA = zip_demo.get(16, 44);
  let percentile_avgs = [percentile_avg_WA, percentile_avg_BA, percentile_avg_HA, percentile_avg_IA, percentile_avg_AA, percentile_avg_TOM];
  
  //--------------------------------------------TOP HEADER / DESCRIPTION---------------------------------------------------
  
  let textXS = 11;
  let textS = 14;
  let textM = 18;
  let textL = 20;
  let textXL = 60;
  let y = posY + 80;
  let x = width/4;
  
  let textX = 50;
  let textH = 40;
  textGrey = color(0, 0, 0, 100);
  textDarkGrey = color(69, 67, 63);
  
  tint(255, 80);
  image(landfill_img, 0, y, width, landfill_img.height*width/landfill_img.width);

  textStyle(BOLD);
  fill(textDarkGrey);
  textSize(textL + 5);
  textAlign(CENTER, CENTER);
  text('L  o  c  a  t  i  o  n        -        L  o  c  a  t  i  o  n        -        L  o  c  a  t  i  o  n', 0, y-2, width);
  noStroke();
  
  textSize(textL);
  textStyle(ITALIC);
  y = y + 80;
  fill(textGrey);
  textAlign(RIGHT);
  let proj_description = 'An investigation of landfill location in the context of the racial and ethnic demographics of US zip codes';
  text(proj_description, width*1/2 - x/2, y + 25, width*4/7);
  //textStyle(NORMAL);
  textAlign(LEFT);
  fill(textDarkGrey);
  let context = 'The United States produces about 290 million tons of municipal waste each year, 50% of which is sent to landfills scattered across the country. The placement of these landfills is of particular concern because residential proximity to environmental hazards, such as landfills, can significantly increase the chances of adverse health outcomes. According to an article in the International Journal of Environmental Research and Public Health, “people living closer to landfill sites suffer from medical conditions such as asthma, cuts, diarrhea, stomach pain, reoccurring flu, cholera, malaria, cough, skin irritation, and tuberculosis more than the people living far away from landfill sites.” The communities bearing the brunt of these health risks are communities of color, as exemplified in environmental justice literature and verified by the results of my research.';
  y = y + 600;
  text(context, x/2, y, width - x);
  y = y + 500;
  textAlign(CENTER);
  let graph_description = 'The chart below separates 33,121 US zip codes into demographic quintiles corresponding to the relative racial populations of each zip code. Each quintile displays the number of landfills contained in those zip codes.';
  text(graph_description, x/2, y, width - x);
  stroke(textDarkGrey);
  strokeWeight(1);
  line(3/2*x, y - 120, width - 3/2*x, y - 120);
  
  //--------------------------------------------SET UP VALUES MEAN / MEDIAN---------------------------------------------------
  //stores the number of landfills in each quintile
  let quintile_WA = [zip_landfill.get(0, 87), zip_landfill.get(0, 110), zip_landfill.get(0, 133), zip_landfill.get(0, 156), zip_landfill.get(0, 179)];
  let quintile_BA = [zip_landfill.get(0, 88), zip_landfill.get(0, 111), zip_landfill.get(0, 134), zip_landfill.get(0, 157), zip_landfill.get(0, 180)];
  let quintile_IA = [zip_landfill.get(0, 89)/2, zip_landfill.get(0, 89)/2, zip_landfill.get(0, 135), zip_landfill.get(0, 158), zip_landfill.get(0, 181)];
  let quintile_AA = [zip_landfill.get(0, 90)/2, zip_landfill.get(0, 90)/2, zip_landfill.get(0, 136), zip_landfill.get(0, 159), zip_landfill.get(0, 182)];
  let quintile_TOM = [zip_landfill.get(0, 93), zip_landfill.get(0, 116), zip_landfill.get(0, 139), zip_landfill.get(0, 162), zip_landfill.get(0, 185)];
  let quintile_HA = [zip_landfill.get(0, 96), zip_landfill.get(0, 119), zip_landfill.get(0, 142), zip_landfill.get(0, 165), zip_landfill.get(0, 188)];
  let demo_quintiles = [quintile_WA, quintile_BA, quintile_HA, quintile_IA, quintile_AA, quintile_TOM];
  
  //stores percent pop at quintile cuttofs
  let quint_per_WA = [zip_demo.get(5, 35), zip_demo.get(6, 35), zip_demo.get(8, 35), zip_demo.get(10, 35), zip_demo.get(12, 35), zip_demo.get(14, 35)];
  let quint_per_BA = [zip_demo.get(5, 36), zip_demo.get(6, 36), zip_demo.get(8, 36), zip_demo.get(10, 36), zip_demo.get(12, 36), zip_demo.get(14, 36)];
  let quint_per_IA = [zip_demo.get(5, 37), zip_demo.get(6, 37), zip_demo.get(8, 37), zip_demo.get(10, 37), zip_demo.get(12, 37), zip_demo.get(14, 37)];
  let quint_per_AA = [zip_demo.get(5, 38), zip_demo.get(6, 38), zip_demo.get(8, 38), zip_demo.get(10, 38), zip_demo.get(12, 38), zip_demo.get(14, 38)];
  let quint_per_TOM = [zip_demo.get(5, 41), zip_demo.get(6, 41), zip_demo.get(8, 41), zip_demo.get(10, 41), zip_demo.get(12, 41), zip_demo.get(14, 41)];
  let quint_per_HA = [zip_demo.get(5, 44), zip_demo.get(6, 44), zip_demo.get(8, 44), zip_demo.get(10, 44), zip_demo.get(12, 44), zip_demo.get(14, 44)];
  let quintile_percents = [quint_per_WA, quint_per_BA, quint_per_HA, quint_per_IA, quint_per_AA, quint_per_TOM];
  
  //stores the number of landfills in above mean zip codes
  let mean_WA = zip_landfill.get(0, 41);
  let mean_BA = zip_landfill.get(0, 42);
  let mean_IA = zip_landfill.get(0, 43);
  let mean_AA = zip_landfill.get(0, 44);
  let mean_TOM = zip_landfill.get(0, 47);
  let mean_HA = zip_landfill.get(0, 50);
  let demo_halves = [mean_WA, mean_BA, mean_IA, mean_AA, mean_TOM, mean_HA];
  
  let demographics = ['White', 'Black', 'Hispanic / Latino', 'American Indian / Alaskan Native', 'Asian', 'Two or more'];
  let avg_landfills = 446.4;


  //--------------------------------------------MAIN BAR CHART---------------------------------------------------
  
  textAlign(LEFT, BOTTOM);
  let SPEED_MULTIPLIER = 15;
  
  y = y + 550;
  let medianW = 80;
  let s = 50;
  let pixel_landfill = 1/2;
  let buffer = 10;
  let textY = y - 250;
  textSize(textS);
  
  //draws the y axes lines and numbers
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);
  for (i = 0; i <= 7; i++) {
    stroke(0, 0, 0, 50);
    strokeWeight(0.25);
    line(x - buffer, y - i*100*pixel_landfill, x + quintile_WA.length*medianW + buffer, y - i*100*pixel_landfill);
    noStroke();
    fill(textGrey);
    text(i*100, x + quintile_WA.length*medianW + 2*buffer, y - i*100*pixel_landfill);
  }
  //draws x axis labels
  textAlign(CENTER, TOP);
  fill(textGrey);
  for (i = 0; i < 6; i++) {
    text(i * 20, x + i*medianW, y + buffer);
  }
  
  //draws explination of percentile category
  stroke(textDarkGrey);
  drawBracket(x, y + buffer + 40, medianW, 10);
  noStroke();
  textAlign(CENTER, TOP);
  text('each quintile represents over 6,600 US zip codes', x - medianW/2, y + buffer + 50, 2*medianW, 50);
  
  //axis labels
  text('# landfills', x + 5*medianW + 30, y - pixel_landfill * 700 - 40);
  text('percentile', x - 60, y + buffer);
  
  
  fill(textDarkGrey);
  stroke(255);
  textAlign(LEFT, CENTER);
  textSize(textS);
  
  for (i = 0; i < demographics.length; i++) {
    if (clicked && (mouseX > textX) && (mouseX < textX + 1.75*medianW) && (mouseY > textY + (i-0.5)*textH + 2*buffer) && (mouseY < textY + (i+0.5)*textH + buffer)) {
      prev_select_fills = select_fills;
      select_fills = i;
    }
    //if newly selected
    if (select_fills == i && select_fills != prev_select_fills) {
      //rect(textX, textY + (i-0.5)*textH + 2*buffer, 1.75*medianW, textH - buffer);
      for (j = 0; j < demo_quintiles[i].length; j++) {
        let h = demo_quintiles[i][j] * pixel_landfill;
        fill(100, 62, 70);
        stroke(255);
        strokeWeight(2);
        rect(x+j*medianW, y, medianW, -h*min(100, SPEED_MULTIPLIER*loops_since_click)/100);
        if (mouseX > x+j*medianW && mouseX < x+(j+1)*medianW && mouseY < y && mouseY > y-h) {
          fill(223, 177, 154, 150);
          rect(x+j*medianW, y-h, medianW, -avg_landfills*pixel_landfill+h);
          fill(255, 255, 255, 200);
          textSize(textS);
          noStroke();
          textAlign(CENTER, CENTER);
          text(round(demo_quintiles[i][j]), x + j*medianW, y-2*buffer, medianW);
          let percent_off = round((demo_quintiles[i][j] - avg_landfills)/avg_landfills * 100);
          if (percent_off > 0) {
            text('+' + percent_off + '%', x + j*medianW, y - h, medianW, h-avg_landfills*pixel_landfill);
          }
          else{
            text(percent_off + '%', x + j*medianW, y - avg_landfills*pixel_landfill, medianW, avg_landfills*pixel_landfill-h);
          }
        }
      }
      textStyle(BOLD);
      textSize(textS+2);
    }
    
    //if already selected
    textAlign(CENTER, CENTER);
    if (select_fills == i && select_fills == prev_select_fills) {
      for (j = 0; j < demo_quintiles[i].length; j++) {
        let h = demo_quintiles[i][j] * pixel_landfill;
        fill(100, 62, 70);
        stroke(255);
        strokeWeight(2);
        rect(x+j*medianW, y, medianW, -h);
        if (mouseX > x+j*medianW && mouseX < x+(j+1)*medianW && mouseY < y && mouseY > y-h) {
          fill(223, 177, 154, 150);
          rect(x+j*medianW, y-h, medianW, -avg_landfills*pixel_landfill+h);
          fill(255, 255, 255, 200);
          textSize(textS);
          noStroke();
          text(round(demo_quintiles[i][j]), x + j*medianW, y-2*buffer, medianW);
          let percent_off = round((demo_quintiles[i][j] - avg_landfills)/avg_landfills * 100);
          if (percent_off > 0) {
            text('+' + percent_off + '%', x + j*medianW, y - h, medianW, h-avg_landfills*pixel_landfill);
          }
          else{
            text(percent_off + '%', x + j*medianW, y - avg_landfills*pixel_landfill, medianW, avg_landfills*pixel_landfill-h);
          }
        }
      }
      textStyle(BOLD);
      textSize(textS+2);
    }
    
    //makes demographic categories at left
    textAlign(LEFT, CENTER);
    fill(textDarkGrey);
    text(demographics[i], textX, textY + textH*i, 1.75*medianW, textH);
    textStyle(NORMAL);
    textSize(textS);
  }
  
  //draws line at average (predicted) number of landfills in each quintile
  stroke(193, 199, 88);
  fill(193, 199, 88);
  strokeWeight(1);
  line(x, y - avg_landfills*pixel_landfill, x + quintile_WA.length*medianW, y - avg_landfills*pixel_landfill);
  noStroke();
  textSize(textM*2);
  text('*', x + buffer, y - avg_landfills*pixel_landfill);
  textSize(textS);
  fill(textDarkGrey);
  let note = 'number of landfills in each quintile under a uniform distribution';
  if (mouseX > x + buffer && mouseX < x + 3*buffer && mouseY > y - avg_landfills*pixel_landfill - 2*buffer && mouseY < y - avg_landfills*pixel_landfill){
    text(note, x + (quintile_WA.length+1)*medianW, y - avg_landfills*pixel_landfill - 1/2 *medianW, 3*medianW, medianW);
    //fill(255);
    //rect(x + buffer, y - avg_landfills*pixel_landfill - 3, 2*buffer, -2*buffer);
  }
  

  //--------------------------------------------MEAN BAR CHARTS---------------------------------------------------
  //Description
  y = y + 250;
  textSize(textL);
  textStyle(ITALIC);
  fill(textDarkGrey);
  textAlign(CENTER);
  let blurb = 'Comparing the numbers of landfills in areas with a racial population below the national average and above the national average across demographics, the opposite trend emerges.';
  text(blurb, x/2, y, width - x);
  
  let below_avg = color(193, 199, 88);
  let above_avg = color(96, 113, 49);//(191, 222, 216);
  
  below_avg.setAlpha(100);
  fill(below_avg);
  rect(x + 25*textL, y - textL/2, 5*textL, textL);
  rect(x - 4.5*textL, y + textL/2 + 3, 8*textL-4, textL);
  above_avg.setAlpha(100);
  fill(above_avg);
  rect(x + 5.25*textL, y + textL/2 + 3, 12.5*textL-4, textL);
  
  y = y + 400;
  let meanW = 20;
  let tot_fills = 2232;
  pixel_landfill = 1/8;
  below_avg.setAlpha(250);
  above_avg.setAlpha(250);
  
  //y axes lines and labels
  textAlign(CENTER);
  textSize(textS);
  textStyle(NORMAL);
  for (i = 0; i <= 10; i++) {
    stroke(0, 0, 0, 50);
    strokeWeight(0.25);
    line(x - buffer, y - i*200*pixel_landfill, x + 12*meanW + buffer + 5*s, y - i*200*pixel_landfill);
    noStroke();
    fill(textGrey);
    text(i*200, x + 12*meanW + 3*buffer + 5*s, y - i*200*pixel_landfill);
  }
  text('# landfills', x + 12*meanW + 3*buffer + 5*s, y - pixel_landfill * 2000 - 30);
  
  //Mini bar charts
  noStroke();
  textSize(textXS);
  textAlign(CENTER, TOP);
  for (i = 0; i < demographics.length; i++) {
    let h = (tot_fills - demo_halves[i]) * pixel_landfill;
    fill(below_avg);
    rect(x + i * (2*meanW + s), y, meanW, -h);
    h = demo_halves[i] * pixel_landfill; //these are the values of landfills above the mean
    fill(above_avg);
    rect(x + (i+0.5)*2*meanW + i*s, y, meanW, -h);
    fill(textDarkGrey);
    text(demographics[i], x + (i-0.5)*2*meanW + i*s, y + buffer, 4*meanW);
  }
  
  //x axis labels
  stroke(textDarkGrey);
  strokeWeight(1);
  line(x - buffer, y, x + 12*meanW + buffer + 5*s, y);
  
  //--------------------------------------------DEMOGRAPHIC CHART---------------------------------------------------
  y = y + 170;
  textSize(textL);
  textStyle(ITALIC);
  noStroke();
  fill(textDarkGrey);
  blurb = 'The distortion present in the figure above arises from uneven numbers of zip codes in each grouping.';
  text(blurb, x/2, y, width - x);
  textStyle(NORMAL);
  
  y = y + 530;
  let pixel_percent = 35;
  textAlign(RIGHT, CENTER);
  textStyle(NORMAL);
  textSize(textS);
  
  //draws the y axes lines and numbers
  for (i = 0; i <= 10; i++) {
    stroke(0, 0, 0, 50);
    strokeWeight(0.25);
    line(x - buffer, y - i*pixel_percent, x + quintile_WA.length*medianW + buffer, y - i*pixel_percent);
    noStroke();
    fill(textGrey);
    text(i*10, x + quintile_WA.length*medianW + 3*buffer, y - i*pixel_percent);
  }
  //draws x axis labels
  textAlign(CENTER, TOP);
  fill(textGrey);
  for (i = 0; i < 6; i++) {
    text(i * 20, x + i*medianW, y + buffer);
  }
  
  //axis labels
  textSize(textS);
  textAlign(LEFT);
  text('% population', x + 5*medianW - buffer, y - pixel_percent*10 - 40);
  textAlign(RIGHT);
  text('percentiles', x - 2*buffer, y + buffer);
  text('share of zipcodes:', x - 2*buffer, y + medianW/2 + 1.5*buffer);
  
  
  fill(textDarkGrey);
  stroke(255);
  textAlign(LEFT, BOTTOM);
  textY = y - 250;
  
  for (i = 0; i < demographics.length; i++) {
    if (clicked && (mouseX > textX) && (mouseX < textX + 1.75*medianW) && (mouseY > textY + (i-0.5)*textH + 2*buffer) && (mouseY < textY + (i+0.5)*textH + buffer)) {
      prev_select_demo = select_demo;
      select_demo = i;
    }
    //if newly selected
    if (select_demo == i) {
      //draws line at national average
      stroke(200, 50, 50);
      fill(200, 50, 50);
      strokeWeight(1);
      let h = ave_zips[i]*10*pixel_percent;
      line(x, y - h, x + quintile_WA.length*medianW, y - h);
      noStroke();
      textSize(textXS);
      textAlign(LEFT, BOTTOM);
      text('National Average', x + buffer/2, y - h - 2);
      noStroke();
      circle(x + (int(percentile_avgs[i])*medianW/20), y - h, 5);
      
      //draw shaded region
      textAlign(CENTER, BOTTOM);
      textSize(textS);
      above_avg.setAlpha(120);
      fill(above_avg);
      rect(x + medianW*5, y, -(medianW*5-int(percentile_avgs[i])*medianW/20), -10*pixel_percent);
      rect(x + medianW*5, y + 50, -(medianW*5-int(percentile_avgs[i])*medianW/20), medianW/3);
      fill(textGrey);
      text('above national avg', x + medianW*5 - (medianW*5-int(percentile_avgs[i])*medianW/20)/2, y + 120);
      text(100-percentile_avgs[i] + '%', x + medianW*5 - (medianW*5-int(percentile_avgs[i])*medianW/20)/2, y + 73);
      stroke(textGrey);
      drawBracket(x + medianW*5 + 2, y + 100, -(medianW*5-int(percentile_avgs[i])*medianW/20), 10);
      below_avg.setAlpha(120);
      fill(below_avg);
      noStroke();
      rect(x, y, int(percentile_avgs[i])*medianW/20, -10*pixel_percent);
      rect(x, y + 50, int(percentile_avgs[i])*medianW/20, medianW/3);
      fill(textGrey);
      text('below national avg', x + (int(percentile_avgs[i])*medianW/20)/2, y + 120);
      text(percentile_avgs[i] + '%', x + (int(percentile_avgs[i])*medianW/20)/2, y + 73);
      stroke(textGrey);
      drawBracket(x, y + 100, int(percentile_avgs[i])*medianW/20-2, 10);
      fill(textGrey);
      textAlign(LEFT);
      
      //draws time series chart
      //let point_coord = [int(percentile_avgs[i])*medianW/20];
      fill(textDarkGrey);
      circle(x + (int(percentile_avgs[i])*medianW/20), y - h, 5);
      for (j = 0; j < quintile_percents[i].length; j++) {
        let h_prev = quintile_percents[i][j-1]*10*pixel_percent;
        let h = quintile_percents[i][j]*10*pixel_percent;
        circle(x+j*medianW, y - h, 5);
        //point_coord = [point_coord x + j*medianW];
        stroke(textDarkGrey);
        if (j != 0 && (x+j*medianW < x+percentile_avgs[i]*medianW/20 || x+(j-1)*medianW > x+percentile_avgs[i]*medianW/20)) {
          line(x+(j-1)*medianW, y - h_prev, x+j*medianW, y-h);
        }
        else if (j != 0) {
          line(x+j*medianW, y-h, x+percentile_avgs[i]*medianW/20, y-ave_zips[i]*10*pixel_percent);
          line(x+(j-1)*medianW, y-h_prev, x+percentile_avgs[i]*medianW/20, y-ave_zips[i]*10*pixel_percent);
        }
        noStroke();
      }
      textStyle(BOLD);
      textSize(14);
    }
    //makes demographic categories at left
    textAlign(LEFT, CENTER);
    fill(textDarkGrey);
    text(demographics[i], textX, textY + textH*i, 1.75*medianW, textH);
    textStyle(NORMAL);
    textSize(textS);
  }
  
  //--------------------------------------------MEAN BAR CHARTS NORMALIZED---------------------------------------------------
  //Description
  y = y + 250;
  textSize(textL);
  textStyle(ITALIC);
  textAlign(CENTER);
  blurb = 'If the number of landfills is instead normalized to the share of zip codes in each category, we can begin to reconcile these trends.';
  text(blurb, x/2, y, width - x);

  y = y + 650;
  above_avg.setAlpha(255);
  below_avg.setAlpha(255);
  
  //y axes lines and labels
  textAlign(CENTER);
  textSize(textS);
  textStyle(NORMAL);
  for (i = 0; i <= 10; i++) {
    stroke(0, 0, 0, 50);
    strokeWeight(0.25);
    line(x - buffer, y - i*400*pixel_landfill, x + 12*meanW + buffer + 5*s, y - i*400*pixel_landfill);
    noStroke();
    fill(textGrey);
    //text(i*200, x + 12*meanW + 3*buffer + 5*s, y - i*200*pixel_landfill);
  }
  text('normalized # landfills', x + 12*meanW + 5*s, y - pixel_landfill * 4000 - 20);
  
  //Mini bar charts
  noStroke();
  textSize(textXS);
  textAlign(CENTER, TOP);
  for (i = 0; i < demographics.length; i++) {
    let h = (tot_fills - demo_halves[i])* 0.5/(percentile_avgs[i]/100) * pixel_landfill;
    fill(below_avg);
    rect(x + i * (2*meanW + s), y, meanW, -h);
    h = demo_halves[i] * 0.5/(1-percentile_avgs[i]/100) * pixel_landfill; //these are the values of landfills above the mean
    fill(above_avg);
    rect(x + (i+0.5)*2*meanW + i*s, y, meanW, -h);
    fill(textDarkGrey);
    text(demographics[i], x + (i-0.5)*2*meanW + i*s, y + buffer, 4*meanW);
  }
  
  //x axis labels
  stroke(textDarkGrey);
  strokeWeight(1);
  line(x - buffer, y, x + 12*meanW + buffer + 5*s, y);
  
  //--------------------------------------------NOTES AND SOURCES---------------------------------------------------
  let appendix1 = '- For American Indian / Alaskan Native and Asian populations, the bottom 40% of zip codes contain zero residents identifying under these categories. As a result, I have averaged the number of landfills over two quintiles.';
  let appendix2 = '- For the purpose of this project, I have used racial and ethnic descriptions as they appear on the US census';
  let appendix3 = '- Landfills without a zip code designation were excluded from this survey.';
  let appendix4 = 'A huge thank you to the teaching staff of 4.032, my peers, my parents, and many others who provided feedback and support throughout this process';
  
  let source1 = '"Hispanic or Latino Origin by Race." National Historical GIS. Last modified 2019. https://www.nhgis.org/user-resources/data-availability.';
  let source2 = '“Landfill Technical Data.” United States Environmental Protection Agency. March 2021. https://www.epa.gov/lmop/landfill-technical-data.';
  let source3 = 'Njoku, Prince O., Joshua N. Edokpayi, and John O. Odiyo. "Health and Environmental Risks of Residents Living Close to a Landfill." International Journal of Environmental Research and Public Health, June 2019. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6617357/#:~:text=Previous%20research%20shows%20that% 20people,34%2C35%2C36%5D. ';
  let source4 = '"National Overview: Facts and Figures on Materials, Wastes and Recycling." United States Environmental Protection Agency. https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/national- overview-facts-and-figures-materials#:~:text=The%20total%20generation%20of%20municipal,25%20million %20tons%20were%20composted. ';
  
  y = y + 170;
  textSize(textS);
  textAlign(LEFT);
  stroke(textGrey);
  strokeWeight(0.5);
  line(2*textX, y - 60, width - 2*textX, y - 60);
  noStroke();
  textStyle(BOLD);
  textGrey.setAlpha(150);
  fill(textGrey);
  text('Notes', 2*textX, y - 2*textS, width - 6*textX);
  textStyle(NORMAL);
  text(appendix1, 2*textX, y, width - 6*textX);
  text(appendix2, 2*textX, y + 5*textS, width - 6*textX);
  text(appendix3, 2*textX, y + 7*textS, width - 6*textX);
  textStyle(BOLD);
  text('Sources', 2*textX, y + 10*textS, width - 6*textX);
  textStyle(NORMAL);
  text(source1, 2*textX, y + 12*textS, width - 6*textX);
  text(source2, 2*textX, y + 15*textS, width - 6*textX);
  text(source3, 2*textX, y + 18*textS, width - 6*textX);
  text(source4, 2*textX, y + 24*textS, width - 6*textX);
  textAlign(CENTER);
  stroke(textGrey);
  strokeWeight(0.5);
  line(2*textX, y + 420, width - 2*textX, y + 420);
  noStroke();
  textSize(textXS+2);
  text(appendix4, 4*textX, y + 460, width - 8*textX);

  clicked = false;
  loops_since_click++;
  
}

function mouseWheel(event) {
  posY -= event.delta; //make the scrolling snap to the graph (for a certain amount of scroll needs to follow graph)
  print(posY);
}

function mouseClicked() {
  clicked = true;
  loops_since_click = 0;
}

function drawBracket(x, y, w, h) {
  line(x, y - h, x, y);
  line(x + w, y - h, x + w, y);
  line(x, y, x + w, y);
}
