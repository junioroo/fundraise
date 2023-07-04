# frozen_string_literal: true

namespace :contract do
  desc 'Deploy contract'
  task :deploy do
    puts "deploying contract.."
    key = Eth::Key.new priv: ENV['PRIVATE_KEY']
    client = Eth::Client.create 'https://rpc-mumbai.maticvigil.com/'
    balance = client.get_balance(key.address)

    unless balance > 0 then raise "Insufficient funds #{balance} on the key" end

    puts "Key Balance: #{balance}\n"

    contract = Eth::Contract.from_file(file: Rails.root.join('assets', 'fundraise.sol'))
    address = client.deploy_and_wait(contract, sender_key: key, gas_limit: 900_000)

    contract = ::App::ContractService.new(address: address).create

    puts "Fundraise Contract #{contract.id} Address: #{address}"
  end
end
