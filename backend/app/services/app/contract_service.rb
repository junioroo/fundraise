module App
  class ContractService
    attr_accessor :params

    def initialize(params)
      @params = params
    end

    def create
      ::Contract.create!(params)
    end
  end
end
