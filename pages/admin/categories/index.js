import CategoriesTreeSelect from '@/components/admin/shared/CategoriesTreeSelect';
import CategoriesTree from '@/components/admin/shared/CategoriesTree';

indexCategoriesAdmin.AdminLayout = true;

export default function indexCategoriesAdmin() {
	return (
		<div>
			<CategoriesTreeSelect />
			<CategoriesTree />
		</div>
	);
}
