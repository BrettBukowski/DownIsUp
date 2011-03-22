require 'kramdown'

class ConvertController < ApplicationController
  def all
    if (params[:text] && request.xhr?)
      begin
        render :text => Kramdown::Document.new(params[:text]).to_html
      rescue Exception => e
        render :text => ""
      end
    end
  end
end