class CreateUserCheerings < ActiveRecord::Migration[6.1]
  def change
    create_table :user_cheerings do |t|
      t.text :text
      t.string :employee_role
      t.references :user

      t.timestamps
    end
  end
end
