class CreateCheerings < ActiveRecord::Migration[6.1]
  def change
    create_table :cheerings do |t|
      t.text :text
      t.string :employee_role
      t.references :user

      t.timestamps
    end
  end
end
