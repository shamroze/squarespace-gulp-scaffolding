// Mobile Navigation

var navdrawerContainer = document.querySelector('.navdrawer-container');

var menuBtn = document.querySelector('.menu');

menuBtn.addEventListener('click', function() {
var isOpen = document.body.classList.contains('open');
if(isOpen) {
  document.body.classList.remove('open');
  navdrawerContainer.classList.remove('open');
} else {
  document.body.classList.add('open');
  navdrawerContainer.classList.add('open');
  jQuery('.navdrawer-container').css('overflow-y', 'scroll');
}
}, true);

var closeBtn = document.querySelector('.nav-close');
closeBtn.addEventListener('click', function() {
  document.body.classList.remove('open');
  navdrawerContainer.classList.remove('open');
  jQuery('.navdrawer-container').css('overflow', 'hidden');
}, true);

// News & Insights Grid View
var grid = document.querySelector('.news .cards');
var msnry = new Masonry( grid, {
  // options...
  itemSelector: '.card',
  columnWidth: 300,
  isFitWidth: true,
  gutter: 30
});