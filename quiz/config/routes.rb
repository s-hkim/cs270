Rails.application.routes.draw do
  # root of site, i.e. its index page
  root 'application#index'
  # other "pages" in the site and the method they invoke
  get '/create/:type' => 'application#create'
  get '/start' => 'application#start'
  get '/submit/:result' => 'application#submit'
  get '/previous' => 'application#previous'
  get '/results' => 'application#results'
  get '/restart' => 'application#restart'
end
