module App
  class ProjectService
    attr_accessor :params

    def initialize(params)
      @params = params
    end

    def create
      ::Project.create!(params)
    end
  end
end
