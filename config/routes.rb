Downisup::Application.routes.draw do
  get "home/index"
  match 'convert/all' => 'convert#all', :via => :post
  root :to => "home#index"
end
