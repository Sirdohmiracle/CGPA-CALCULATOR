
//hide loading gif
document.querySelector('#loading').style.display = 'none';

//course class
class Courses{
    constructor(courseCode, courseName, unit, score){
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.unit = unit;
        this.score = score;
    }
}

class UI{
    addToList(courses){
        const list = document.querySelector('#courses');
        //crreate tr element
        const row = document.createElement('tr');
        // insert html rows
        row.innerHTML = `
        <td class="course-code table-style" style="text-transform:uppercase">${courses.courseCode}</td>
        <td class="course-name table-style" >${courses.courseName}</td>
        <td class="unit table-style">${courses.unit}</td>
        <td><input type='number' class='score score-style' value='${courses.score}'></td>
        <td><a href='#' class="delete">x<a></td>
        `
        list.appendChild(row);
    }
    showAlert(error){
        const errorDiv = document.createElement('div');

        const container = document.querySelector('.add-form');
        const form = document.querySelector('#gpa-form');
        
        
        errorDiv.className = 'alert alert-danger';
        
        errorDiv.appendChild(document.createTextNode(error));
        
        container.insertBefore(errorDiv, form);
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
       
    }
    showLoad(){
            const loading = document.querySelector('#loading');
            const  grade = document.querySelector('.grade-point');
        
            loading.style.display = 'block';
            grade.style.display = 'none';
    }
    removeLoad(){
        const loading = document.querySelector('#loading');
        const  grade = document.querySelector('.grade-point');
    
        loading.style.display = 'none';
        grade.style.display = 'block';
}
    clearFields(){
        const courseCode = document.querySelector('#courseCode').value = '',
          courseName = document.querySelector('#courseName').value = '',
          unit = document.querySelector('#unit').value = '',  
          score = document.querySelector('#score').value = '';
    }
    deleteFromList(target){
        if(target.className === 'delete' ){
            target.parentElement.parentElement.remove();
        }
    }
    calcGpa(){
        //store units in an array
        const unitInArray = Array.from(document.querySelectorAll('.unit')).map(e => parseInt(e.textContent));
        //store units * grade in an array
        const unitScoreInArray = Array.from(document.querySelectorAll('.score')).map(e => {
            let scoreGrade;
            //change score to grade 
            if(parseInt(e.value) >= 70){
                scoreGrade = 5;
            }else if(parseInt(e.value) >= 60 && parseInt(e.value) < 70 ){
                scoreGrade = 4;
            }else if(parseInt(e.value) >= 50 && parseInt(e.value) < 60){
                scoreGrade = 3;
            }else if(parseInt(e.value) >= 45 && parseInt(e.value) < 50 ){
                scoreGrade = 2;
            }else if(parseInt(e.value) >= 40 && parseInt(e.value) < 45 ){
                scoreGrade = 1;
            }else{
                scoreGrade = 0;
            }
            const unitScore = scoreGrade * parseInt(e.parentElement.previousElementSibling.textContent);
            return unitScore;
        })
        // Get the sum of each arrays
        const sumUnitInArray = unitInArray.reduce((p,e) => p + e, 0);
        const sumUnitScoreInArray = unitScoreInArray.reduce((p,e) => p + e, 0);
        //calculate the cgpa
        const CGPA = sumUnitScoreInArray/sumUnitInArray;
        //convert to 2 d.p
        document.querySelector('#cgpa').value = CGPA.toFixed(2);

    }
    addDegreeText(){
        const cgpa = document.querySelector('#cgpa');
        let degreeText = document.querySelector('#degree');
        if (cgpa.value >= 4.5){
            degreeText.textContent = 'You are on a first class';
        }else if(cgpa.value >= 3.5 && cgpa.value < 4.5){
            degreeText.textContent = 'You are on a Second class(Upper Division)';
        }else if(cgpa.value >= 2.5 && cgpa.value < 3.5){
            degreeText.textContent = 'You are on a Second class(Lower Division)';
        }else if(cgpa.value >=1.5 && cgpa.value < 2.5){
            degreeText.textContent = 'You are on a Third class';
        }else if(cgpa.value === ''){
            degreeText.textContent = 'You have no CGPA';
        }
        else{
            degreeText.textContent = 'You have a pass';
        }
    }
}


// Local Storage Class
class Store {
    static getCourses() {
      let courses;
      if(localStorage.getItem('courses') === null) {
        courses = [];
      } else {
        courses = JSON.parse(localStorage.getItem('courses'));
      }
      return courses;
    }

    static getCgpa(){
        let cgpa;
        if(localStorage.getItem('cgpa') === null) {
            cgpa = '';
          } else {
            cgpa = JSON.parse(localStorage.getItem('cgpa'));
          }
      
          return cgpa;
    }
  
    static displayCourses() {
      const courses = Store.getCourses();
  
      courses.forEach(function(course){
        const ui  = new UI;
  
        // Add book to UI
        ui.addToList(course);
    
      });

      const cgpa = Store.getCgpa();
      const ui = new UI;
      ui.calcGpa();
      ui.addDegreeText();

    }
  
    static addCourse(course) {
      const courses = Store.getCourses();
  
      courses.push(course);
  
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  
    static removeCourse(courseCode) {
      const courses = Store.getCourses();
  
      courses.forEach(function(course, index){
       if(course.courseCode === courseCode) {
        courses.splice(index, 1);
       }
      });
  
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }
  
// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayCourses);
  
// Event Listener for add course
document.querySelector("#gpa-form").addEventListener('submit', function(e){
    //instantiate UI
    const ui = new UI;
    
    //load
    ui.showLoad();
    setTimeout(() => {
            //unload
            ui.removeLoad();
            const courseCode = document.querySelector('#courseCode').value,
            courseName = document.querySelector('#courseName').value,
            unit = document.querySelector('#unit').value,  
            score = document.querySelector('#score').value;

            const course = new Courses(courseCode, courseName, unit, score);
            
            
            if (courseCode === '' || courseName === '' || unit === '' || score === ''){
                ui.showAlert('please fill in all fields');
            }else{
            //Add book to list
            ui.addToList(course);
            // Add to LS
            Store.addCourse(course);
            // clear input fields
            ui.clearFields();
            //calc cgpa
            ui.calcGpa();
            //add text
            ui.addDegreeText()
        }

       
    }, 1000);
   
    e.preventDefault()
});


//Event listener for removing course
document.querySelector('#courses').addEventListener('click', function(e){  
   
    ui = new UI;
    //remove from list
    ui.deleteFromList(e.target);
    // Remove from LS
    Store.removeCourse(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
    //calc gp
    ui.calcGpa();
    //add degree text
    ui.addDegreeText();

   
    e.preventDefault();
});

//Event listener for calculating cgpa

document.querySelector('#calc-gp').addEventListener('click', function(e){

    ui = new UI;
    //load
    ui.showLoad();
    setTimeout(() => {
        //unload
        ui.removeLoad();
        //calc gp
        ui.calcGpa();
        //add degree text
        ui.addDegreeText();
    }, 1000);

    e.preventDefault();
})

