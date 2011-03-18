require 'kramdown'

class ConvertController < ApplicationController
  def all
    if (parms[:text] && request.xhr?)
      render :text => Kramdown::Document.new(text).to_html
    end
  end
end